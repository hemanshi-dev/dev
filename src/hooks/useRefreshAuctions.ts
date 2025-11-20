import {useAtom} from 'jotai';
import {auctionsAtom, updateAuctionsAtom} from '../atoms/auctionAtoms';
import {fetchAuthenticatedLiveAuctions, fetchLiveAuctions, fetchLotsForAuction, getCategories} from '../api';
import {Auction} from "../../lib/types";
import {isAuthenticatedAtom} from "../atoms/authAtoms";
import {addLotsAtom} from "../atoms/lotsAtoms";
import _ from "lodash";

export const useRefreshAuctions = () => {
    const [, addLots] = useAtom(addLotsAtom);
    const [auctions, updateAuctions] = useAtom(auctionsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);
    const [, updateSingleAuction] = useAtom(updateAuctionsAtom);

    return () => {
        let promise = fetchLiveAuctions;
        if (isAuthenticated) {
            promise = fetchAuthenticatedLiveAuctions;
        }
        promise()
            .then((liveAuctions) => {
                updateAuctions({
                    ...auctions,
                    live: _.keyBy(liveAuctions, 'id')
                })
                liveAuctions.forEach((auction: Auction) => {
                    //fetch categories
                    getCategories(auction.id)
                        .then((categories) => {
                            auction.categories = categories;
                            updateSingleAuction({type: 'live', auction});

                        });
                });

                liveAuctions.map(async (auction: Auction) => {
                    const lots = await fetchLotsForAuction(auction.id, 1, 5000, isAuthenticated);
                    addLots({auctionId: auction.id, lots});
                })
            });
    }
};