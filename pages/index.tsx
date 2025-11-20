import {useAtom} from "jotai/index";
import {configurationAtom, headerRibbonAtom, landingSettingsAtom, pageTitleAtom} from "../src/atoms/stateAtoms";
import {liveAuctionsAtom} from "../src/atoms/auctionAtoms";
import {useRefreshAuctions} from "../src/hooks/useRefreshAuctions";
import {updateMyBidsAtom} from "../src/atoms/filterAtoms";
import {useEffect} from "react";
import {Box, Center, Group, ScrollArea, Stack} from "@mantine/core";
import _ from "lodash";
import AuctionCard from "../components/auction/AuctionCard";

export default function IndexPage() {
    const [, setPageTitle] = useAtom(pageTitleAtom)
    const [auctions] = useAtom(liveAuctionsAtom)
    const refreshAuctions = useRefreshAuctions()
    const [, setHeaderRibbon] = useAtom(headerRibbonAtom)
    const [, updateMyBids] = useAtom(updateMyBidsAtom);
    const [landingSettings,] = useAtom(landingSettingsAtom)

    const [configurations,] = useAtom(configurationAtom)
    const getMenuFooterTotals = () => {
        return configurations.footerHeight + configurations.navMenuHeight + configurations.menuRibbonHeight
    }

    useEffect(() => {
        updateMyBids('all')
        setPageTitle('Upcoming Auctions')
        setHeaderRibbon(<></>)
        refreshAuctions()
    }, [])

    return (
        <ScrollArea
            scrollbars={'y'}
            h={{
                base: `calc(100vh - ${getMenuFooterTotals() + 50}px)`,
                md: `calc(100vh - ${getMenuFooterTotals() + 20}px)`,
            }}
        >
            <Stack>
                <Group>
                    <Center w={'100vw'}>
                        <Box h={400} w={{xs: '100%', sm: 1050}}>
                            <iframe style={{position: 'relative'}} src={landingSettings?.auction_video_url.value}
                                    width={'100%'}
                                    height={400}
                            />
                        </Box>
                    </Center>

                </Group>
                {
                    _.values(auctions).map((auction, index) =>
                        <Center key={index}>
                            <AuctionCard isWatched={false} auction={auction}/>
                        </Center>)
                }
            </Stack>
        </ScrollArea>

    );
}
