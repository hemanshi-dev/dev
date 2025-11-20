import {Badge, Button, Card, Center, Divider, Grid, Group, Image, Modal, ScrollArea, Stack, Text} from "@mantine/core";
import {useRouter} from "next/router";
import {useAtom} from "jotai";
import {
    getLiveLotByIdAtom,
    lotsAtom,
    nextLotAtom,
    previousLotAtom,
    updateLotAtom
} from "../../../../../src/atoms/lotsAtoms";
import {useEffect, useRef, useState} from "react";
import {IconArrowLeft, IconArrowRight, IconStar} from "@tabler/icons-react";
import {Carousel} from "@mantine/carousel";
import {fetchLotById, unWatchLot, watchLot} from "../../../../../src/api";
import Autoplay from "embla-carousel-autoplay";
import CountdownTimer from "../../../../../components/common/CountdownTimer";
import dayjs from "dayjs";
import {liveAuctionsAtom} from "../../../../../src/atoms/auctionAtoms";
import helpers from "../../../../../src/utils/helpers";
import SelectBidView from "../../../../../components/lot/SelectBidView";
import {configurationAtom, headerRibbonAtom} from "../../../../../src/atoms/stateAtoms";
import AuctionRegistrationForm from "../../../../../components/auction/AuctionRegistrationForm";
import {isAuthenticatedAtom} from "../../../../../src/atoms/authAtoms";

export default function LotPage() {
    const router = useRouter()
    const {id, lotId} = router.query
    const auctionId = parseInt(id as string);
    const lotItemId = parseInt(lotId as string);
    const [lots] = useAtom(lotsAtom)


    const [getLot] = useAtom(getLiveLotByIdAtom);
    //const [lot, setLot] = useState<Lot | null>(null);
    const autoplay = useRef(Autoplay({delay: 2000}));
    const [auctions,] = useAtom(liveAuctionsAtom)
    const auction = auctions[parseInt(id?.toString() ?? '')]
    const [images, setImages] = useState<string[]>(getLot(auctionId, lotItemId)?.image)
    const [, updateLot] = useAtom(updateLotAtom)
    const [isBusy, setIsBusy] = useState(false)
    const [, setHeaderRibbon] = useAtom(headerRibbonAtom)
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [isAuthenticated,] = useAtom(isAuthenticatedAtom)
    const [previousLot] = useAtom(previousLotAtom)
    const [nextLot] = useAtom(nextLotAtom)
    const [configurations,] = useAtom(configurationAtom)

    const getMenuFooterTotals = () => {
        return configurations.footerHeight + configurations.navMenuHeight + configurations.menuRibbonHeight
    }

    useEffect(() => {
        setHeaderRibbon(<></>)
        if (!lotItemId)
            return
        fetchLotById(lotItemId)
            .then((lot) => {
                updateLot({auctionId: auctionId, updatedLot: lot})
            })
    }, [lotItemId]);


    const handleWatchLot = () => {
        setIsBusy(true)
        let lot = getLot(auctionId, lotItemId)
        if (!getLot(auctionId, lotItemId).is_watched) {
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

    const getLabel = (label: string, value: string) => {
        return (<Group justify={'flex-start'}>
            <Text ml={20} c={'#00008B'} fw={500} w={80} size={'sm'} variant={'transparent'}>{label} : </Text>
            <Text fz={14}>{value}</Text>
        </Group>)
    }
    const handlePreviousLot = () => {
        const prevLotId = previousLot(auctionId, lotItemId);
        if (prevLotId !== null) {
            router.push(`/UpcomingAuctions/${auctionId}/Lots/${prevLotId}`);
        }
    }

    const handleNextLot = () => {
        const nextLotId = nextLot(auctionId, lotItemId);
        if (nextLotId !== null) {
            router.push(`/UpcomingAuctions/${auctionId}/Lots/${nextLotId}`);
        }
    }

    if (!getLot(auctionId, lotItemId)) {
        return <></>
    }

    const getTimerAndLabel = () => {
        const hasAuctionStarted = dayjs(auction.starts).isBefore(dayjs());
        const countDownDate = hasAuctionStarted ? dayjs(auction.ends) : dayjs(auction.starts);

        return (
            <Stack>
                <Text c={'gray.7'} fw={500}
                      size="xs">{hasAuctionStarted ? 'Ends' : 'Starts'}: {countDownDate.format('MMM DD, YYYY HH:mm a')}</Text>
                <CountdownTimer timestamp={countDownDate.unix() * 1000}
                                completedComponent={<></>}/>
            </Stack>
        )
    }

    return (
        <ScrollArea h={{
            base: `calc(100vh - ${getMenuFooterTotals() + 50}px)`,
            md: `calc(100vh - ${getMenuFooterTotals() + 20}px)`,
        }}>
            <Center>
                <Stack w={{sm: '100%', md: 1100}}>
                    <Button onClick={() => router.push(`/UpcomingAuctions/${auctionId}/Lots`)} w={140}>
                        Back To Lots
                    </Button>
                    <Group justify={'space-between'}>
                        <Group justify={'flex-start'}>
                            <Badge tt={'none'} size={'lg'} radius={5}>
                                {getLot(auctionId, lotItemId)?.lotnumber}{getLot(auctionId, lotItemId)?.lotnumberext}
                            </Badge>
                            <Text fw={600}>
                                {getLot(auctionId, lotItemId)?.title}
                            </Text>
                        </Group>
                        <Group justify={'flex-end'}>

                            {
                                isAuthenticated &&
                                <Button disabled={isBusy} onClick={handleWatchLot} leftSection={<IconStar size={14}/>}
                                        variant={getLot(auctionId, lotItemId)?.is_watched ? 'filled' : 'outline'}
                                        color={getLot(auctionId, lotItemId)?.is_watched ? 'yellow' : 'primary'}
                                >{getLot(auctionId, lotItemId)?.is_watched ? 'Unwatch' : 'Watch'}</Button>

                            }
                            <Button onClick={handlePreviousLot}
                                    leftSection={<IconArrowLeft size={14}/>}>Previous</Button>
                            <Button onClick={handleNextLot} rightSection={<IconArrowRight size={14}/>}>Next</Button>
                        </Group>
                    </Group>
                    <Grid>
                        <Grid.Col span={{xs: 12, sm: 7}}>
                            <Carousel
                                w={'100%'}
                                plugins={[autoplay.current]}
                                onMouseEnter={autoplay.current.stop}
                                onMouseLeave={autoplay.current.reset}

                                withIndicators>
                                {
                                    getLot(auctionId, lotItemId)?.image?.map(url => (
                                        <Carousel.Slide w={'100%'} key={url}>
                                            <Image src={url}/>
                                        </Carousel.Slide>
                                    ))
                                }
                            </Carousel>
                        </Grid.Col>
                        <Grid.Col span={{xs: 12, sm: 5}}>
                            <Stack gap={0}>
                                <Card mb={10} withBorder>
                                    {getTimerAndLabel()}
                                </Card>
                                {helpers.getLotBanner(getLot(auctionId, lotItemId), auction, getLot(auctionId, lotItemId)?.user_bids)}
                                <Text mt={10} mb={10} fw={700}>{auction?.auction_type}</Text>
                                <Text mb={10} fz={14}>{auction?.title}</Text>
                                <Divider mb={10}/>
                                <Badge size={'lg'} variant={'transparent'}>Location
                                    :</Badge>
                                <Text ml={20} fz={14}>{auction?.location}</Text>
                                <Badge size={'lg'} variant={'transparent'}>Description
                                    :</Badge>
                                <Text ml={20} fz={14}>{getLot(auctionId, lotItemId)?.description}</Text>
                                {getLabel('Year', getLot(auctionId, lotItemId)?.year)}
                                {getLabel('Model', getLot(auctionId, lotItemId)?.model)}
                                {getLabel('Mileage', getLot(auctionId, lotItemId)?.mileage)}
                                {getLabel('Engine No', getLot(auctionId, lotItemId)?.engine_number)}
                                {getLabel('Vin No', getLot(auctionId, lotItemId)?.vin_number)}
                                {getLabel('Other', getLot(auctionId, lotItemId)?.other ?? '')}


                                <Divider mb={10}/>
                                {
                                    (isAuthenticated && dayjs(getLot(auctionId, lotItemId).end_time).isAfter(dayjs())) &&
                                    <>
                                        {
                                            auction?.is_auction_registered ?
                                                (
                                                    auction.auction_registration_status === 'Approved' ?
                                                        <SelectBidView auction={auction}
                                                                       lot={getLot(auctionId, lotItemId)}
                                                                       close={() => {
                                                                       }}/> : <></>
                                                )
                                                :
                                                <Button onClick={() => setShowRegistrationModal(true)}>Register to
                                                    Bid</Button>

                                        }
                                    </>
                                }

                                <Modal size={800}
                                       title={<Text fw={700} fz={15}>{auction?.auction_type} | {auction?.title}</Text>}
                                       opened={showRegistrationModal}
                                       onClose={() => setShowRegistrationModal(false)}>
                                    <AuctionRegistrationForm auction={auction}
                                                             close={() => setShowRegistrationModal(false)}/>
                                </Modal>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Center>
        </ScrollArea>
    );
}