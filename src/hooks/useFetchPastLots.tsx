import {useAtom} from 'jotai';
import {addLotsAtom, pastLotsAtom} from '../atoms/lotsAtoms';
import {fetchLotsForAuction} from '../api';
import {isAuthenticatedAtom} from "../atoms/authAtoms";

export const useFetchPastLots = (auctionId: number) => {
    const [pastLots, setPastLots] = useAtom(pastLotsAtom);
    const [, addLots] = useAtom(addLotsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);


    return async () => {
        if (pastLots[auctionId]) {
            return pastLots[auctionId];
        } else {
            const lots = await fetchLotsForAuction(auctionId, 0, 5000, isAuthenticated);
            addLots({auctionId, lots});
            setPastLots({...pastLots, [auctionId]: lots});
            return lots;
        }
    };
};