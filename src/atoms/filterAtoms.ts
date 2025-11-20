import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';

// Atom to store filter settings
export const filtersAtom = atomWithStorage('filters', {
    search: '',
    perPage: 10,
    jumpToLot: '',
    page: 1,
    categories: [] as number | string[],
    watched: 'all',
    my_bids: 'all',
    totalPages: 1,
});

// Atom to update the search phrase
export const updateSearchAtom = atom(
    null,
    (get, set, search: string) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, search});
    }
);

export const updateWatchedAtom = atom(
    null,
    (get, set, watched: string) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, watched});
    }
);
export const updateMyBidsAtom = atom(
    null,
    (get, set, my_bids: string) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, my_bids});
    }
);


// Atom to update the number of lots per page
export const updatePerPageAtom = atom(
    null,
    (get, set, perPage: number) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, perPage});
    }
);

// Atom to update the jump to lot
export const updateJumpToLotAtom = atom(
    null,
    (get, set, jumpToLot: string) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, jumpToLot});
    }
);

// Atom to update the current page number
export const updatePageAtom = atom(
    null,
    (get, set, page: number) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, page});
    }
);
// Atom to update the total pages
export const updateTotalPagesAtom = atom(
    null,
    (get, set, totalPages: number) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, totalPages});
    }
);

// Atom to update the selected categories
export const updateCategoriesAtom = atom(
    null,
    (get, set, categories: number | string[]) => {
        const filters = get(filtersAtom);
        set(filtersAtom, {...filters, categories});
    }
);