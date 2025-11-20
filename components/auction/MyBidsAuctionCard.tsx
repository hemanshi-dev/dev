import {Badge, Button, Center, Flex, Grid, Image, Modal, Paper, Stack, Text} from "@mantine/core";
import CountdownTimer from "../common/CountdownTimer";
import {Auction} from "../../lib/types";
import dayjs from "dayjs";
import DateBadge from "../common/DateBadge";
import Link from "next/link";
import {useState} from "react";
import AuctionRegistrationForm from "./AuctionRegistrationForm";
import {useAtom} from "jotai";
import {lotsCountByAuctionAtom} from "../../src/atoms/lotsAtoms";

export default function MyBidsAuctionCard({auction, isWatched = true}: { auction: Auction, isWatched: boolean }) {
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [lotsCount,] = useAtom(lotsCountByAuctionAtom)

    const getDateLabel = (date: dayjs.Dayjs, label: string, badgeColor: string) => (
        <DateBadge color={badgeColor} date={date} label={label}/>
    );

    const getRegistrationComponent = () => {
        const status = auction.auction_registration_status;
        if (!auction.is_auction_registered) {
            return (
                <Button onClick={() => setShowRegistrationModal(true)} mr={10} color={'primary.9'} radius={'sm'} h={50}>
                    REGISTER TO BID
                </Button>
            );
        }
        const statusColors = {
            'Pending': 'yellow.9',
            'Rejected': 'red.9',
            'Approved': 'green.9'
        };

        if (!status)
            return <></>

        if (!statusColors[status as keyof typeof statusColors])
            return <></>
        return (
            <Badge color={statusColors[status as keyof typeof statusColors]} w={'100%'} radius={"xs"} size={'lg'}>
                {status}
            </Badge>
        );

    };

    return (
        <Paper withBorder shadow="xs" p="xl">
            <Grid w={{xs: '100%', sm: 1000}}>
                <Grid.Col span={{xs: 12, sm: 4}}>
                    <Image width={'100%'} src={auction.image} alt={auction.title}/>
                </Grid.Col>
                <Grid.Col span={{xs: 12, sm: 4}}>
                    <Stack>
                        <Text c={'gray.7'} fw={700} size="xl">{auction.title}</Text>
                        <Text c={'gray.6'} fw={500} size="xs">{auction.description}</Text>
                        <Text c={'gray.7'} fw={500}
                              size="xs">Ends: {dayjs(auction.ends).format('MMM DD, YYYY HH:mm a')}</Text>
                        <CountdownTimer timestamp={dayjs(auction.ends).unix() * 1000}
                                        completedComponent={<Text c={'red.5'} fw={700} fz={'15'}>Closed</Text>}/>
                    </Stack>
                </Grid.Col>
                <Grid.Col span={{xs: 12, sm: 4}}>
                    <Stack>
                        <Badge color={'primary.7'} w={'100%'} radius={"xs"} size={'lg'}>{auction.auction_type}</Badge>
                        {getDateLabel(dayjs(auction.starts), 'Starting Date', 'green')}
                        {getDateLabel(dayjs(auction.ends), 'Ending Date', 'primary.7')}
                        <Flex justify={'flex-end'}>
                            <Center m={10}>
                                {getRegistrationComponent()}
                            </Center>
                            <Center>
                                <Link href={`/MyBids/${auction.id}/Lots`}
                                      passHref>
                                    <Button color={'gray.7'} radius={'sm'}
                                            h={50}>{lotsCount(auction.id)} Lots</Button>
                                </Link>
                            </Center>
                        </Flex>
                    </Stack>
                </Grid.Col>
            </Grid>
            <Modal size={800} title={<Text fw={700} fz={15}>{auction.auction_type} | {auction.title}</Text>}
                   opened={showRegistrationModal}
                   onClose={() => setShowRegistrationModal(false)}>
                <AuctionRegistrationForm auction={auction} close={() => setShowRegistrationModal(false)}/>
            </Modal>
        </Paper>
    );
}