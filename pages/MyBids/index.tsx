import {Center, Stack} from "@mantine/core";
import {useAtom} from "jotai";
import {headerRibbonAtom, pageTitleAtom} from "../../src/atoms/stateAtoms";
import {useEffect} from "react";
import _ from "lodash";
import {useRefreshAuctions} from "../../src/hooks/useRefreshAuctions";
import {bidAuctionsAtom} from "../../src/atoms/lotsAtoms";
import MyBidsAuctionCard from "../../components/auction/MyBidsAuctionCard";
import {updateMyBidsAtom} from "../../src/atoms/filterAtoms";

export default function UpcomingAuctions() {
    const [, setPageTitle] = useAtom(pageTitleAtom)
    const [auctions] = useAtom(bidAuctionsAtom)
    const refreshAuctions = useRefreshAuctions()
    const [, setHeaderRibbon] = useAtom(headerRibbonAtom)
    const [, updateMyBids] = useAtom(updateMyBidsAtom);

    useEffect(() => {
        updateMyBids('bid')
        setPageTitle('My Bids')
        refreshAuctions()
    }, [])


    return (
        <Stack>
            {
                _.values(auctions).map((auction, index) =>
                    <Center key={index}>
                        <MyBidsAuctionCard isWatched={false} auction={auction}/>
                    </Center>)
            }
        </Stack>

    );
}
