import {Lot} from "../../lib/types";
import {ActionIcon, Badge, Button, Card, Center, Flex, Group, Image, Modal, Stack, Text} from "@mantine/core";
import {useAtom} from "jotai/index";
import {liveAuctionsAtom} from "../../src/atoms/auctionAtoms";
import {useState} from "react";
import {unWatchLot, watchLot} from "../../src/api";
import {reRenderLotsAtom, updateLotAtom} from "../../src/atoms/lotsAtoms";
import dayjs from "dayjs";
import CompactCountdownTimer from "../common/CompactCountdownTimer";
import helpers from "../../src/utils/helpers";
import {IconStar} from "@tabler/icons-react";
import PlaceBid from "../lot/PlaceBid";
import {useRouter} from "next/router";
import AuctionRegistrationForm from "./AuctionRegistrationForm";
import {isAuthenticatedAtom} from "../../src/atoms/authAtoms";

export default function LotCompactCard({lot}: { lot: Lot }) {
    const [auctions,] = useAtom(liveAuctionsAtom)
    const auction = auctions[lot.auctionid]
    const [showPlaceBidModal, setShowPlaceBidModal] = useState(false)
    const [, updateLot] = useAtom(updateLotAtom)
    const [isBusy, setIsBusy] = useState(false)
    const router = useRouter()
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [isAuthenticated,] = useAtom(isAuthenticatedAtom)
    const [refreshLots, setRefreshLots] = useAtom(reRenderLotsAtom)
    const hasAuctionStarted = dayjs(auction.starts).isBefore(dayjs());


    const user_bids = (lot.user_bids !== undefined) ? lot.user_bids : -1;

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
        <Card w={{xs: '100%',}} shadow="sm"
              padding="lg" radius="md" withBorder>
            <Card.Section h={300}>
                <Center bg={'gray'} pos={'absolute'} w={'100%'} h={300}>
                    <Image h={300} src={lot.image[0]} alt={lot.title}/>
                </Center>
                <Stack w={'100%'} p={5} style={{position: "absolute"}}>
                    <Group h={30} justify={'space-between'}>
                        {
                            isAuthenticated ? <ActionIcon disabled={isBusy} color={lot.is_watched ? 'yellow' : 'gray'}
                                                          onClick={handleWatchLot}
                                                          variant={"filled"}
                                                          aria-label="Settings">
                                    <IconStar style={{width: '70%', height: '70%'}} stroke={1.5}/>
                                </ActionIcon>
                                :
                                <Group/>
                        }

                        <CompactCountdownTimer
                            timestamp={dayjs(hasAuctionStarted ? lot.end_time : auction.starts).unix() * 1000}
                            completedComponent={<></>} onComplete={() => {

                            if (!hasAuctionStarted) return

                            updateLot({
                                auctionId: lot.auctionid,
                                updatedLot: {...lot, lot_status: 'CLOSED STC', lot_status_color: '#E15650'}
                            })

                            setRefreshLots(!refreshLots)

                        }}/>
                    </Group>
                    <Flex h={240} direction={'column'} justify={'flex-end'}>
                        {helpers.getLotBanner(lot, auction, user_bids, 0.8)}
                    </Flex>
                </Stack>
            </Card.Section>

            <Group justify="space-between" mt="xs">
                <Badge radius={5} size={'lg'} color={'primary'}>{lot.lotnumber}{lot.lotnumberext}</Badge>
            </Group>
            <Group justify="space-between" mb="xs">
                <Text lineClamp={1} fw={500}>{lot.title}</Text>
            </Group>

            <Group justify={'space-between'}>
                {
                    (isAuthenticated && dayjs(lot.end_time).isAfter(dayjs())) ? <>
                        {
                            auction?.is_auction_registered ? (
                                    auction.auction_registration_status === 'Approved' ?
                                        <Button onClick={() => setShowPlaceBidModal(true)}>
                                            Place Bid
                                        </Button> : <></>
                                )

                                :
                                <Button onClick={() => setShowRegistrationModal(true)}>
                                    Register to Bid
                                </Button>
                        }
                    </> : <Group/>
                }


                <Button onClick={() => router.push(`/UpcomingAuctions/${auction.id}/Lots/${lot.id}`)}>
                    View
                </Button>
            </Group>
            <Modal size={600} title={'Place Bid'} opened={showPlaceBidModal} onClose={() => {
                setShowPlaceBidModal(false)
            }}>
                <PlaceBid lot={lot} close={() => setShowPlaceBidModal(false)}/>
            </Modal>

            <Modal size={800}
                   title={<Text fw={700} fz={15}>{auction.auction_type} | {auction.title}</Text>}
                   opened={showRegistrationModal}
                   onClose={() => setShowRegistrationModal(false)}>
                <AuctionRegistrationForm auction={auction} close={() => setShowRegistrationModal(false)}/>
            </Modal>
        </Card>

    )
}