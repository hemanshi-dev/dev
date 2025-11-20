import {useAtom} from 'jotai';
import {isAuthenticatedAtom, tokenAtom} from '../atoms/authAtoms';
import {userAtom} from '../atoms/userAtoms';
import {updateAuctionsAtom} from '../atoms/auctionAtoms';
import {addLotsAtom} from '../atoms/lotsAtoms';
import {fetchLiveAuctions, fetchLotsForAuction, fetchPastAuctions, fetchUser, getCategories, login} from '../api';
import {Auction} from "../../lib/types";

export const useInitializeApp = () => {
    const [, setToken] = useAtom(tokenAtom);
    const [, setUser] = useAtom(userAtom);
    const [, updateAuctions] = useAtom(updateAuctionsAtom);
    const [, addLots] = useAtom(addLotsAtom);
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);


    const loginUser = async (email: string, password: string, deviceName: string) => {
        const token = await login(email, password, deviceName); // Pass errors up
        setToken(token);
    };

    const initializeApp = async () => {
        const user = await fetchUser(); // Fetch user profile
        setUser(user);
        console.log(isAuthenticated)

        const liveAuctions = await fetchLiveAuctions(); // Fetch live auctions
        liveAuctions.forEach((auction: Auction) => {
            getCategories(auction.id)
                .then((categories) => {
                    auction.categories = categories;
                    updateAuctions({type: 'live', auction});
                });
        });

        // Fetch lots for each live auction
        await Promise.all(
            liveAuctions.map(async (auction: Auction) => {
                const lots = await fetchLotsForAuction(auction.id, 1, 5000, true);
                addLots({auctionId: auction.id, lots});
            })
        );

        const pastAuctions = await fetchPastAuctions(); // Fetch past auctions
        pastAuctions.forEach((auction: Auction) => {
            updateAuctions({type: 'past', auction});
        });
    };

    return {loginUser, initializeApp};
};