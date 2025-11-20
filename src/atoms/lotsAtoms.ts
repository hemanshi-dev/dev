import {atom, useAtom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import {Lot} from "../../lib/types";
import {filtersAtom} from './filterAtoms';
import {liveAuctionsAtom} from "./auctionAtoms";

// Atom to store lots categorized by auctionId, keyed by lot id
export const lotsAtom = atomWithStorage<Record<number, Record<number, Lot>>>('lots', {});
export const pastLotsAtom = atomWithStorage<Record<number, Record<number, Lot>>>('pastLots', {});

export const reRenderLotsAtom = atom(true);

function sortLots(lots: Lot[]): Lot[] {
    const now = new Date().getTime();

    // Separate open and closed lots
    const openLots = lots.filter(lot => new Date(lot.end_time).getTime() > now);
    const closedLots = lots.filter(lot => new Date(lot.end_time).getTime() <= now);

    // Sort open lots by end_time, lotnumber, and lotnumberext
    const sortedOpenLots = openLots.sort((a, b) => {
        if (a.end_time !== b.end_time) {
            return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
        }
        if (a.lotnumber !== b.lotnumber) {
            return a.lotnumber - b.lotnumber;
        }
        return a.lotnumberext.localeCompare(b.lotnumberext);
    });

    // Sort closed lots by lotnumber and lotnumberext
    const sortedClosedLots = closedLots.sort((a, b) => {
        if (a.lotnumber !== b.lotnumber) {
            return a.lotnumber - b.lotnumber;
        }
        return a.lotnumberext.localeCompare(b.lotnumberext);
    });

    // Combine open and closed lots
    return [...sortedOpenLots, ...sortedClosedLots];
}

function sortAndFilterLots(lots: Lot[], filters: any, withPagination: boolean = true): Lot[] {

    let filteredLots = sortLots(lots);

    // Apply watched filter
    if (filters.watched === 'watched') {
        filteredLots = filteredLots.filter(lot => lot.is_watched);
    } else if (filters.watched === 'unwatched') {
        filteredLots = filteredLots.filter(lot => !lot.is_watched);
    }

    // Apply my_bids filter
    if (filters.my_bids === 'bid') {
        filteredLots = filteredLots.filter(lot => lot.has_your_bid);
    } else if (filters.my_bids === 'no_bid') {
        filteredLots = filteredLots.filter(lot => !lot.has_your_bid);
    }

    // Apply search filter
    if (filters.search && filters.search.length > 0) {
        filteredLots = filteredLots.filter(lot =>
            lot.title.toLowerCase().includes(filters.search.toLowerCase())
        );
    }

    // Apply category filter if categories is an array with items
    if (Array.isArray(filters.categories) && filters.categories.length > 0) {
        filteredLots = filteredLots.filter(lot =>
            filters.categories.includes(lot.category_id?.toString())
        );
    }

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.perPage;

    if (withPagination) {
        return filteredLots.slice(startIndex, startIndex + filters.perPage);
    } else {
        return filteredLots;
    }
}

// Derived atom to get lots for a specific auction
export const lotsByAuctionAtom = atom((get) => (auctionId: number) => {

    const lots = Object.values(get(lotsAtom)[auctionId] || {});
    const filters = get(filtersAtom);
    return sortAndFilterLots(lots, filters);
});

export const pastLotsByAuctionAtom = atom((get) => (auctionId: number) => {
    const lots = Object.values(get(pastLotsAtom)[auctionId] || {});
    return lots.sort((a, b) => {
        if (a.end_time !== b.end_time) {
            return new Date(a.end_time).getTime() - new Date(b.end_time).getTime();
        }
        if (a.lotnumber !== b.lotnumber) {
            return a.lotnumber - b.lotnumber;
        }
        return a.lotnumberext.localeCompare(b.lotnumberext);
    });
});

// Atom to add lots for a specific auction
export const addLotsAtom = atom(null, (get, set, {auctionId, lots}: { auctionId: number; lots: Lot[] }) => {
    const currentLots = get(lotsAtom)[auctionId] || {};
    const newLots = lots.reduce((acc, lot) => {
        acc[lot.id] = lot;
        return acc;
    }, {} as Record<number, Lot>);
    set(lotsAtom, {...get(lotsAtom), [auctionId]: {...currentLots, ...newLots}});
});

// Atom to update a specific lot
export const updateLotAtom = atom(
    null,
    (get, set, {auctionId, updatedLot}: { auctionId: number; updatedLot: Lot }) => {
        const currentLots = get(lotsAtom)[auctionId] || {};
        set(lotsAtom, {...get(lotsAtom), [auctionId]: {...currentLots, [updatedLot.id]: updatedLot}});
    }
);

// Function to get a single live lot by its ID
export const getLiveLotByIdAtom = atom((get) => (auctionId: number, lotId: number) =>
    get(lotsAtom)[auctionId]?.[lotId] || null
);

// Function to get a single past lot by its ID
export const getPastLotByIdAtom = atom((get) => (auctionId: number, lotId: number) =>
    get(pastLotsAtom)[auctionId]?.[lotId] || null
);

// Derived atom to get auctions with watched lots
export const watchedAuctionsAtom = atom((get) => {
    const liveAuctions = get(liveAuctionsAtom);
    const lots = get(lotsAtom);

    return Object.values(liveAuctions).filter(auction => {
        const auctionLots = lots[auction.id] || {};
        return Object.values(auctionLots).some(lot => lot.is_watched);
    });
});


export function searchLotByNumber(auctionId: number, lotNumberWithExt: string) {
    const [lots] = useAtom(lotsAtom);
}

// Derived atom to get auctions with bid lots
export const bidAuctionsAtom = atom((get) => {
    const liveAuctions = get(liveAuctionsAtom);
    const lots = get(lotsAtom);

    return Object.values(liveAuctions).filter(auction => {
        const auctionLots = lots[auction.id] || {};
        return Object.values(auctionLots).some(lot => lot.has_your_bid);
    });
});

// Derived atom to get the count of lots for a specific auction considering filters
export const lotsCountByAuctionAtom = atom((get) => (auctionId: number, withPagination: boolean = false) => {
    const lots = Object.values(get(lotsAtom)[auctionId] || {});
    const filters = get(filtersAtom);

    return sortAndFilterLots(lots, filters, false).length;
});

export const previousLotAtom = atom(
    (get) => (auctionId: number, lotId: number): number | null => {
        const lots = Object.values(get(lotsAtom)[auctionId] || {});
        const sortedLots = sortAndFilterLots(lots, get(filtersAtom), false);
        const index = sortedLots.findIndex(lot => lot.id === lotId);

        if (index === -1) return null;

        const previousIndex = (index - 1 + sortedLots.length) % sortedLots.length;
        return sortedLots[previousIndex].id;
    }
);

export const nextLotAtom = atom(
    (get) => (auctionId: number, lotId: number): number | null => {
        const lots = Object.values(get(lotsAtom)[auctionId] || {});
        const sortedLots = sortAndFilterLots(lots, get(filtersAtom), false);
        const index = sortedLots.findIndex(lot => lot.id === lotId);

        if (index === -1) return null;

        const nextIndex = (index + 1) % sortedLots.length;
        return sortedLots[nextIndex].id;
    }
);

export const myBidsAtom = atom((get) => (auctionId: number) => {
    const lots = get(lotsAtom)[auctionId] || {};
    let bidLots: Lot[] = [];

    Object.values(lots).forEach(lot => {
        if (lot.has_your_bid) {
            bidLots.push(lot);
        }
    });

    return bidLots;
});

export const myBidsCountAtom = atom((get) => (auctionId: number) => {
    const bidLots = get(myBidsAtom)(auctionId);
    return bidLots.length;
});

export const outbidLotsAtom = atom((get) => (auctionId: number) => {
    const lots = get(lotsAtom)[auctionId] || {};
    let outbidLots: Lot[] = [];

    Object.values(lots).forEach(lot => {
        if (lot.has_your_bid && !lot.is_winner) {
            outbidLots.push(lot);
        }
    });

    return outbidLots;
});

export const outbidLotsCountAtom = atom((get) => (auctionId: number) => {
    const outbidLots = get(outbidLotsAtom)(auctionId);
    return outbidLots.length;
});

export const winningLotsAtom = atom((get) => (auctionId: number) => {
    const lots = get(lotsAtom)[auctionId] || {};
    let winningLots: Lot[] = [];

    Object.values(lots).forEach(lot => {
        if (lot.is_winner === true) {
            winningLots.push(lot);
        }
    });

    return winningLots;
});

export const winningLotsCountAtom = atom((get) => (auctionId: number) => {
    const winningLots = get(winningLotsAtom)(auctionId);
    return winningLots.length;
});

export const watchedLotsAtom = atom((get) => (auctionId: number) => {
    const lots = get(lotsAtom)[auctionId] || {};
    let watchedLots: Lot[] = [];

    Object.values(lots).forEach(lot => {
        if (lot.is_watched) {
            watchedLots.push(lot);
        }
    });

    return watchedLots;
});

export const watchedLotsCountAtom = atom((get) => (auctionId: number) => {
    const winningLots = get(watchedLotsAtom)(auctionId);
    return winningLots.length;
});
