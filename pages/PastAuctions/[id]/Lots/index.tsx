import {Center, Grid, Loader, ScrollArea, Stack} from "@mantine/core";
import {useAtom} from "jotai/index";
import {pageTitleAtom} from "../../../../src/atoms/stateAtoms";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {pastAuctionsAtom} from "../../../../src/atoms/auctionAtoms";
import {Lot} from "../../../../lib/types";
import {fetchLotsForAuction} from "../../../../src/api";
import PastLotCompactCard from "../../../../components/auction/PastLotCompactCard";
import {isAuthenticatedAtom} from "../../../../src/atoms/authAtoms";

export default function LotsPage() {
    const [, setPageTitle] = useAtom(pageTitleAtom);
    const [auctions] = useAtom(pastAuctionsAtom);
    const router = useRouter();
    const {id} = router.query;
    const [isAuthenticated] = useAtom(isAuthenticatedAtom);


    useEffect(() => {
        setPageTitle('Lots');
    }, [setPageTitle]);

    const auction = auctions[parseInt(id?.toString() ?? '')];
    const [lots, setLots] = useState<Lot[]>([]);
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        setLoading(true)
        fetchLotsForAuction(parseInt(id?.toString() ?? ''), 0, 100, isAuthenticated)
            .then(r => {
                setLots(r);
                setLoading(false)
            })
    }, [auction]);

    if (!auction) return <></>;
    if (loading) return <Center h={'60vh'}><Loader/></Center>

    return (
        <Center>
            <Stack w={'100%'}>
                <ScrollArea scrollbars={'y'} h={'calc(100vh - 220px)'}>
                    <Grid>
                        {lots.map((lot, index) => (
                            <Grid.Col span={{base: 12, sm: 6, lg: 4}}>
                                <PastLotCompactCard auction={auction} lot={lot} key={index}/>
                            </Grid.Col>
                        ))}
                    </Grid>

                </ScrollArea>

            </Stack>
        </Center>
    );
}