import {Lot} from "../../lib/types";
import {useRef} from "react";
import {Grid, Image, Stack, Text} from "@mantine/core";
import CountdownTimer from "../common/CountdownTimer";
import dayjs from "dayjs";
import {Carousel} from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import SelectBidView from "./SelectBidView";
import {useAtom} from "jotai/index";
import {liveAuctionsAtom} from "../../src/atoms/auctionAtoms";

export default function PlaceBid({lot, close}: { lot: Lot, close?: () => void }) {
    const [auctions,] = useAtom(liveAuctionsAtom)
    const auction = auctions[lot.auctionid]


    const autoplay = useRef(Autoplay({delay: 2000}));
    return (
        <Stack>
            <Grid>
                <Grid.Col span={{xs: 12, md: 12}}>
                    <Carousel
                        withControls={false}
                        withIndicators
                        w={'100%'}
                        plugins={[autoplay.current]}
                        onMouseEnter={autoplay.current.stop}
                        onMouseLeave={autoplay.current.reset}
                    >
                        {lot.image.map((image, index) => (
                            <Carousel.Slide key={index}>
                                <Image mt={-20} src={image} alt={lot.title}/>
                            </Carousel.Slide>
                        ))}
                    </Carousel>

                </Grid.Col>
                <Grid.Col span={{xs: 12, md: 12}}>
                    <Stack>
                        <Text fz={15} fw={600}>{lot.title}</Text>
                        <CountdownTimer timestamp={dayjs(lot.end_time).unix() * 1000} completedComponent={<>Closed</>}/>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={12}>
                    <SelectBidView lot={lot} auction={auction} close={close}/>
                </Grid.Col>
            </Grid>
        </Stack>
    );
}