import {Badge, Button, Card, Center, Divider, Grid, Group, Image, Modal, Stack, Text} from "@mantine/core";
import {useRouter} from "next/router";
import {useAtom} from "jotai";
import {getLiveLotByIdAtom, lotsAtom, updateLotAtom} from "../../../../../src/atoms/lotsAtoms";
import {useEffect, useRef, useState} from "react";
import {LotDetailResponse} from "../../../../../lib/types";
import {IconArrowLeft, IconArrowRight, IconStar} from "@tabler/icons-react";
import {Carousel} from "@mantine/carousel";
import {fetchLotDetails, unWatchLot, watchLot} from "../../../../../src/api";
import Autoplay from "embla-carousel-autoplay";
import CountdownTimer from "../../../../../components/common/CountdownTimer";
import dayjs from "dayjs";
import {liveAuctionsAtom} from "../../../../../src/atoms/auctionAtoms";
import helpers from "../../../../../src/utils/helpers";
import SelectBidView from "../../../../../components/lot/SelectBidView";
import {headerRibbonAtom} from "../../../../../src/atoms/stateAtoms";
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
    const [lotDetail, setLotDetail] = useState<LotDetailResponse>()
    const [images, setImages] = useState<string[]>(getLot(auctionId, lotItemId)?.image)
    const [, updateLot] = useAtom(updateLotAtom)
    const [isBusy, setIsBusy] = useState(false)
    const [, setHeaderRibbon] = useAtom(headerRibbonAtom)
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [isAuthenticated,] = useAtom(isAuthenticatedAtom)


    useEffect(() => {
        console.log(getLot(auctionId, lotItemId))
        setHeaderRibbon(<></>)
        fetchLotDetails(getLot(auctionId, lotItemId)?.ref_id ?? '')
            .then((lotDetails) => {
                setLotDetail(lotDetails);
                setImages(lotDetails.lot.image)
            });
    }, []);

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

    return (
        <Center>
            <Stack w={1100}>
                <Button onClick={() => router.back()} w={140}>
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
                        <Button leftSection={<IconArrowLeft size={14}/>}>Previous</Button>
                        <Button rightSection={<IconArrowRight size={14}/>}>Next</Button>
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
                                getLot(auctionId, lotItemId)?.images?.map(url => (
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
                                <Stack>
                                    <Text fw={600}>ENDS IN</Text>
                                    <CountdownTimer
                                        timestamp={dayjs(getLot(auctionId, lotItemId)?.end_time).unix() * 1000}
                                        completedComponent={<>Closed</>}/>
                                </Stack>
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
                            <Text fz={14}><Badge size={'lg'} variant={'transparent'}>Year
                                :</Badge>{getLot(auctionId, lotItemId)?.year}</Text>
                            <Text fz={14}><Badge size={'lg'} variant={'transparent'}>Model
                                :</Badge>{getLot(auctionId, lotItemId)?.model}</Text>
                            <Text fz={14}><Badge size={'lg'} variant={'transparent'}>Mileage
                                :</Badge>{getLot(auctionId, lotItemId)?.mileage}</Text>
                            <Text fz={14}><Badge size={'lg'} variant={'transparent'}>Engine No
                                :</Badge>{getLot(auctionId, lotItemId)?.engine_number}</Text>
                            <Text fz={14}> <Badge size={'lg'} variant={'transparent'}>Vin No
                                :</Badge>{getLot(auctionId, lotItemId)?.vin_number}</Text>
                            <Text mb={10} fz={14}> <Badge size={'lg'} variant={'transparent'}>Other
                                :</Badge>{getLot(auctionId, lotItemId)?.other}
                            </Text>

                            <Divider mb={10}/>
                            {
                                isAuthenticated &&
                                <>
                                    {
                                        auction?.is_auction_registered ?
                                            (lotDetail &&
                                                <SelectBidView auction={auction} lot={getLot(auctionId, lotItemId)}
                                                               close={() => {
                                                               }}/>) :
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
    );
}