import {getAuction, getCategories} from '../api';
import {useAtom} from "jotai";
import {updateAuctionsAtom} from "../atoms/auctionAtoms";

export const useUpdateAuction = (auctionId: number) => {
    const [, updateAuctions] = useAtom(updateAuctionsAtom);

    return () => {
        getAuction(auctionId)
            .then((auction) => {
                if (!auction.is_past) {
                    getCategories(auction.id)
                        .then((categories) => {
                            auction.categories = categories;
                            updateAuctions({type: 'live', auction});
                        });
                } else {
                    updateAuctions({type: 'past', auction: auction});
                }
            });
    }

};