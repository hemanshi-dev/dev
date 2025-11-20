import {useAtom} from 'jotai';
import {auctionsAtom, updateAuctionsAtom} from '../atoms/auctionAtoms';
import {fetchPastAuctions} from '../api';
import {isAuthenticatedAtom} from "../atoms/authAtoms";
import {addLotsAtom} from "../atoms/lotsAtoms";
import _ from "lodash";

export const useRefreshPastAuctions = () => {
    const [, addLots] = useAtom(addLotsAtom);
    const [auctions, updateAuctions] = useAtom(auctionsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [, updateSingleAuction] = useAtom(updateAuctionsAtom);

    return () => {
        fetchPastAuctions()
            .then((pastAuction) => {
                updateAuctions({
                    ...auctions,
                    past: _.keyBy(pastAuction, 'id')
                })
            });
    }
};