import {Badge, Button, Flex, Grid, Image, Paper, Stack, Text} from "@mantine/core";
import CountdownTimer from "../common/CountdownTimer";
import {Auction} from "../../lib/types";
import dayjs, {Dayjs} from "dayjs";
import DateBadge from "../common/DateBadge";
import Link from "next/link";


export default function PastAuctionCard({auction}: { auction: Auction }) {
    const getDateLabel = (date: Dayjs, label: string, badgeColor: string) => {
        return (
            <DateBadge color={badgeColor} date={date} label={label}/>)
    }

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
                        <Text c={'gray.7'} fw={500} size="xs">Ends
                            : {dayjs(auction.ends).format('MMM DD, YYYY HH:mm a')}</Text>
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
                            <Link href={`/PastAuctions/${auction.id}/Lots`} passHref>
                                <Button color={'gray.7'} radius={0} h={50}
                                        size={'lg'}>{auction.lots} Lots</Button>
                            </Link>
                        </Flex>
                    </Stack>
                </Grid.Col>
            </Grid>

        </Paper>

    )
}