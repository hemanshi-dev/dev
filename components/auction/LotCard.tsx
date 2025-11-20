import {Lot} from "../../lib/types";
import {ActionIcon, Box, Button, Center, Flex, Group, Image, Modal, Paper, Stack, Text} from "@mantine/core";
import {IconStar} from "@tabler/icons-react";
import dayjs from "dayjs";
import {useAtom} from "jotai/index";
import {liveAuctionsAtom} from "../../src/atoms/auctionAtoms";
import {useState} from "react";
import PlaceBid from "../lot/PlaceBid";
import Link from "next/link";
import helpers from "../../src/utils/helpers";
import {unWatchLot, watchLot} from "../../src/api";
import {updateLotAtom} from "../../src/atoms/lotsAtoms";
import CountdownTimer from "../common/CountdownTimer";

export default function LotCard({lot}: { lot: Lot }) {
    const [auctions,] = useAtom(liveAuctionsAtom)
    const auction = auctions[lot.auctionid]
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false)
    const [, updateLot] = useAtom(updateLotAtom)
    const [isBusy, setIsBusy] = useState(false)

    const user_bids = (lot.user_bids !== undefined) ? lot.user_bids : -1;


    const getTimer = () => {
        const hasAuctionStarted = dayjs(auction.starts).isBefore(dayjs());
        const countDownDate = hasAuctionStarted ? dayjs(auction.ends) : dayjs(auction.starts);

        return (
            <CountdownTimer timestamp={countDownDate.unix() * 1000}
                            completedComponent={<></>}/>
        )
    }
    const handleWatchLot = () => {
        setIsBusy(true)
        if (!lot.is_watched) {
            watchLot(lot.ref_id).then(() => {
                lot.is_watched = true;
                updateLot({auctionId: lot.auctionid, updatedLot: lot})
                setIsBusy(false)
            })
        } else {
            unWatchLot(lot.ref_id).then(() => {
                lot.is_watched = false;
                updateLot({auctionId: lot.auctionid, updatedLot: lot})
                setIsBusy(false)
            })
        }

    }


    return (
        <Paper mb={10} withBorder>
            <Group>
                <Box w={60} h={'100%'} bg={'primary.9'}>
                    <Stack>
                        <Flex justify={"center"}>
                            <Text fw={600} c={'white'}>LOT</Text>
                        </Flex>
                        <Center h={140}>
                            <Text fw={600} c={'white'}>{lot.lotnumber}{lot.lotnumberext}</Text>
                        </Center>
                    </Stack>
                </Box>
                <Center w={200}>
                    <Image mt={-20} w={200} src={lot.image[0]} alt={lot.title}/>
                </Center>

                <Stack w={200} p={10}>
                    <Group>
                        <ActionIcon disabled={isBusy} color={lot.is_watched ? 'yellow' : 'primary'}
                                    onClick={handleWatchLot}
                                    variant={lot.is_watched ? 'filled' : 'transparent'}
                                    aria-label="Settings">
                            <IconStar style={{width: '70%', height: '70%'}} stroke={1.5}/>
                        </ActionIcon>
                        <Link href={`/UpcomingAuctions/${auction.id}/Lots/${lot.id}`} passHref>
                            <Text fw={700} fz={17} c={'primary.9'}>
                                {lot.title}
                            </Text>
                        </Link>

                    </Group>
                    <Group>
                        <Text fw={800} fz={15}>Year :</Text>
                        <Text fw={600} fz={15}>{lot.year}</Text>
                    </Group>
                    {
                        auction?.is_auction_registered ?
                            <Button onClick={() => setShowPlaceBidModal(true)}>
                                Place Bid
                            </Button> :
                            <Button>
                                Register to Bid
                            </Button>
                    }


                </Stack>
                <Stack w={300} h={200}>
                    <Center h={150}>
                        {getTimer()}
                    </Center>
                    {helpers.getLotBanner(lot, auction, user_bids)}
                </Stack>
            </Group>
            <Modal size={600} title={'Place Bid'} opened={showPlaceBidModal} onClose={() => {
                setShowPlaceBidModal(false)
            }}>
                <PlaceBid lot={lot} close={() => setShowPlaceBidModal(false)}/>
            </Modal>
        </Paper>

    )
}