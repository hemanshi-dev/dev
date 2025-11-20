import {Center, Grid, ScrollArea, Stack} from "@mantine/core";
import {useAtom} from "jotai/index";
import {headerRibbonAtom, pageTitleAtom} from "../../../../src/atoms/stateAtoms";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {liveAuctionsAtom} from "../../../../src/atoms/auctionAtoms";
import LotsFilterBar from "../../../../components/auction/LotsFilterBar";

import LotCompactCard from "../../../../components/auction/LotCompactCard";
import {filtersAtom, updateMyBidsAtom} from "../../../../src/atoms/filterAtoms";
import {lotsByAuctionAtom} from "../../../../src/atoms/lotsAtoms";

export default function LotsPage() {
    const [, setPageTitle] = useAtom(pageTitleAtom)
    const [auctions,] = useAtom(liveAuctionsAtom)
    const [auctionLots,] = useAtom(lotsByAuctionAtom)
    const router = useRouter();
    const {id} = router.query;
    const [filters,] = useAtom(filtersAtom)
    const [, setHeaderRibbon] = useAtom(headerRibbonAtom)
    //const [auction, setAuction] = useState<Auction | undefined>()
    const auction = auctions[parseInt(id?.toString() ?? '')]
    const [, updateMyBids] = useAtom(updateMyBidsAtom);


    useEffect(() => {
        updateMyBids('bid')
        setPageTitle('Lots')
    }, [])


    const getLots = () => {
        return auctionLots(auction?.id ?? 0)
    }

    if (!auction) return <></>


    return (
        <Center>
            <Stack w={'100%'}>
                <Grid>
                    <Grid.Col visibleFrom={'md'} span={{md: 3, lg: 2}}>
                        <ScrollArea h={'calc(100vh - 220px)'}>
                            <LotsFilterBar auction={auction}/>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 9, lg: 10}}>
                        <ScrollArea scrollbars={'y'} h={'calc(100vh - 220px)'}>
                            <Grid>
                                {
                                    getLots().map((lot, index) =>
                                        <Grid.Col span={{base: 12, sm: 6, lg: 4}}>
                                            <LotCompactCard lot={lot} key={index}/>
                                        </Grid.Col>
                                    )
                                }
                            </Grid>

                        </ScrollArea>

                    </Grid.Col>
                </Grid>
            </Stack>

        </Center>

    );
}