import {Center, Grid, LoadingOverlay, Pagination, ScrollArea, Stack, Tabs} from "@mantine/core";
import {useAtom} from "jotai";
import {pageTitleAtom} from "../../src/atoms/stateAtoms";
import {useEffect, useState} from "react";
import {pastAuctionsAtom} from "../../src/atoms/auctionAtoms";
import {Lot} from "../../lib/types";
import PastBidLotCompactCard from "../../components/auction/PastBidLotCompactCard";
import {getPastBids} from "../../src/api";

export default function PastAuctions() {
    const [, setPageTitle] = useAtom(pageTitleAtom)
    const [auctions] = useAtom(pastAuctionsAtom)
    const [lots, setLots] = useState<Lot[]>([])
    const [perPage, setPerPage] = useState(50)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [tab, setTab] = useState('all')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setPageTitle('Past Bids')
        setLoading(true)
        getPastBids(tab, page, perPage)
            .then(r => {
                setLots(r.lots)
                setTotal(r.pagination.total)
                setPerPage(r.pagination.top)
                setLoading(false)
            })
    }, [page, tab])

    return (
        <Center>
            <Stack w={'100%'}>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>

                <Tabs onChange={(value) => {
                    setTab(value ?? 'all')
                    setPage(1)
                }} variant="pills" defaultValue="all">
                    <Tabs.List>
                        <Tabs.Tab value="all">
                            All
                        </Tabs.Tab>
                        <Tabs.Tab value="won">
                            Won
                        </Tabs.Tab>
                        <Tabs.Tab value="lost">
                            Lost
                        </Tabs.Tab>
                    </Tabs.List>

                </Tabs>
                <ScrollArea scrollbars={'y'} h={'calc(100vh - 300px)'}>
                    <Grid>
                        {lots?.map((lot, index) => (
                            <Grid.Col span={{base: 12, sm: 6, lg: 4}}>
                                <PastBidLotCompactCard lot={lot} key={index}/>
                            </Grid.Col>
                        ))}
                    </Grid>

                </ScrollArea>

                <Center>
                    <Pagination onChange={setPage} total={Math.ceil(total / perPage)}/>
                </Center>
            </Stack>
        </Center>

    );
}
