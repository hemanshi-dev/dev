import {useAtom} from "jotai";
import {headerRibbonAtom, pageTitleAtom} from "../../src/atoms/stateAtoms";
import {Group, Text} from "@mantine/core";
import LotPageHeaderRibbon from "../auction/LotsPageHeaderRibbon";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

export function HeaderRibbon() {
    const [pageTitle, setPageTitle] = useAtom(pageTitleAtom);
    const [headerRibbon,] = useAtom(headerRibbonAtom);
    const [ribbon, setRibbon] = useState(<></>)
    const router = useRouter();

    useEffect(() => {
        //determine which ribbon to show based on route
        if (router.pathname === '/UpcomingAuctions/[id]/Lots' ||
            router.pathname === '/MyBids/[id]/Lots/[id]' ||
            router.pathname === '/MyBids/[id]/Lots' ||
            router.pathname === '/UpcomingAuctions/[id]/Lots/[id]'
        ) {
            setRibbon(<LotPageHeaderRibbon/>)
        } else {
            setRibbon(<></>)
        }
    }, [router.pathname]);

    return (
        <Group h={80} justify={'space-between'} align={'center'}>
            <Text pl={20} c={'primary.9'} fz={"h3"} fw={700}>{pageTitle}</Text>
            {ribbon}
        </Group>
    )
}