import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import {Auction} from "../../lib/types";

// Atom to store all auctions categorized by type, keyed by id
export const auctionsAtom = atomWithStorage<{
    live: { [id: number]: Auction };
    past: { [id: number]: Auction }
}>('auctions', {
    live: {},
    past: {},
});


// Derived atom to get live auctions
export const liveAuctionsAtom = atom((get) => get(auctionsAtom).live);

// Derived atom to get past auctions
export const pastAuctionsAtom = atom((get) => get(auctionsAtom).past);

// Atom to update auctions for a specific type
export const updateAuctionsAtom = atom(
    null,
    (get, set, {type, auction}: { type: 'live' | 'past'; auction: Auction }) => {
        const current = get(auctionsAtom);
        set(auctionsAtom, {
            ...current,
            [type]: {
                ...current[type],
                [auction.id]: auction,
            },
        });
    }
);
