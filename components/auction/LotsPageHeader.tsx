import {Box, Center, Grid, Group, Stack, Text} from "@mantine/core";
import {Auction} from "../../lib/types";
import DateBadge from "../common/DateBadge";
import dayjs from "dayjs";

export default function LotsPageHeader({auction}: { auction: Auction }) {

    return (
        <Box p={10} pt={20} bg={'gray.2'}>
            <Grid>
                <Grid.Col span={6}>
                    <Group>
                        <Box bg={'white'} p={5}>
                            <Group>
                                <DateBadge color={'primary.9'} date={dayjs(auction.starts)}/>
                                <DateBadge color={'primary.9'} date={dayjs(auction.ends)}/>
                            </Group>
                        </Box>
                        <Text fw={600} fz={14}>{auction.title}</Text>
                    </Group>
                    <Group p={10}>
                        <Text c={'gray.7'} fz={14}>{auction.description}</Text>
                    </Group>
                    <Group p={10}>
                        <Text c={'gray.7'} fw={500} size="xs">ENDS
                            : {dayjs(auction.ends).format('MMM DD, YYYY HH:mm a')}</Text>
                    </Group>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Center h={'100%'}>
                        <Text fw={600} fz={15}>Viewing</Text>
                    </Center>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Center h={'100%'}>
                        <Stack>
                            <Text fw={600} fz={15}>Location</Text>
                            <Text c={'gray.7'} fw={500} fz={14}>{auction.location}</Text>
                        </Stack>
                    </Center>
                </Grid.Col>
            </Grid>

        </Box>)
}