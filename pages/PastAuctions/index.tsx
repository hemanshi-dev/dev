import {Center, Stack} from "@mantine/core";
import {useAtom} from "jotai";
import {pageTitleAtom} from "../../src/atoms/stateAtoms";
import {useEffect} from "react";
import {pastAuctionsAtom} from "../../src/atoms/auctionAtoms";
import PastAuctionCard from "../../components/auction/PastAuctionCard";
import _ from "lodash";
import {useRefreshPastAuctions} from "../../src/hooks/useRefreshPastAuctions";

export default function PastAuctions() {
    const [, setPageTitle] = useAtom(pageTitleAtom)
    const [auctions] = useAtom(pastAuctionsAtom)
    const refreshPastAuctions = useRefreshPastAuctions()


    useEffect(() => {
        setPageTitle('Past Auctions')
        refreshPastAuctions()
    }, [])

    return (
        <Stack>
            {
                _.values(auctions).map((auction, index) =>
                    <Center key={index}>
                        <PastAuctionCard auction={auction}/>
                    </Center>)
            }
        </Stack>

    );
}
