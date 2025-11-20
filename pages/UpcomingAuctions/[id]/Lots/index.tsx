import {Center, Grid, Loader, Pagination, ScrollArea, Stack} from "@mantine/core";
import {useAtom} from "jotai/index";
import {configurationAtom, headerRibbonAtom, pageTitleAtom} from "../../../../src/atoms/stateAtoms";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {liveAuctionsAtom} from "../../../../src/atoms/auctionAtoms";
import LotsFilterBar from "../../../../components/auction/LotsFilterBar";
import {lotsByAuctionAtom, lotsCountByAuctionAtom, reRenderLotsAtom} from "../../../../src/atoms/lotsAtoms";
import {filtersAtom, updateMyBidsAtom, updatePageAtom} from "../../../../src/atoms/filterAtoms";
import LotsView from "../../../../components/lot/LotsView";
import {useRefreshAuctions} from "../../../../src/hooks/useRefreshAuctions";

export default function LotsPage() {
    const [, setPageTitle] = useAtom(pageTitleAtom)
    const [auctions,] = useAtom(liveAuctionsAtom)
    const [auctionLots,] = useAtom(lotsByAuctionAtom)
    const router = useRouter();
    const {id} = router.query;
    const [filters,] = useAtom(filtersAtom)
    const [, setHeaderRibbon] = useAtom(headerRibbonAtom)
    //const [auction, setAuction] = useState<Auction | undefined>()
    const [auction, setAuction] = useState(auctions[parseInt(id?.toString() ?? '')])
    const [, updateMyBids] = useAtom(updateMyBidsAtom);
    const [, updatePage] = useAtom(updatePageAtom);
    const [refresh,] = useAtom(reRenderLotsAtom)

    const [lotsCount,] = useAtom(lotsCountByAuctionAtom)
    const [configurations,] = useAtom(configurationAtom)

    const refreshAuctions = useRefreshAuctions()
    const [loading, setLoading] = useState(true)


    const getMenuFooterTotals = () => {
        return configurations.footerHeight + configurations.navMenuHeight + configurations.menuRibbonHeight
    }

    useEffect(() => {
        setPageTitle('Lots')
        updateMyBids('all')
    }, [])

    useEffect(() => {

    }, [refresh]);

    useEffect(() => {
        if (!auction) {
            refreshAuctions()
        }
    }, []);


    if (!auction) return (<Center>
        <Loader size="xl"/>
    </Center>)

    return (
        <Center>
            <Stack w={'100%'}>
                <Grid>
                    <Grid.Col visibleFrom={'md'} span={{md: 3, lg: 2}}>
                        <ScrollArea h={{
                            base: `calc(100vh - ${getMenuFooterTotals() + 50}px)`,
                            md: `calc(100vh - ${getMenuFooterTotals() + 20}px)`,
                        }}>
                            <LotsFilterBar auction={auction}/>
                        </ScrollArea>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 9, lg: 10}}>
                        <LotsView lots={auctionLots(auction?.id ?? 0)}/>
                        <Center hiddenFrom={"md"} pt={10}>
                            <Pagination size={'xs'}
                                        total={filters.totalPages}
                                        value={filters.page}
                                        onChange={(page) => updatePage(page)}/>
                        </Center>

                    </Grid.Col>
                </Grid>
            </Stack>

        </Center>

    );
}