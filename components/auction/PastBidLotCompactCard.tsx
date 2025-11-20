import {Lot} from "../../lib/types";
import {Badge, Card, Center, Flex, Group, Image, Stack, Text} from "@mantine/core";
import helpers from "../../src/utils/helpers";
import {useRouter} from "next/router";

export default function PastBidLotCompactCard({lot}: { lot: Lot }) {
    const router = useRouter()

    const user_bids = (lot.user_bids !== undefined) ? lot.user_bids : -1;


    return (
        <Card w={{xs: '100%',}} shadow="sm"
              padding="lg" radius="md" withBorder>
            <Card.Section h={300}>
                <Center bg={'gray'} pos={'absolute'} w={'100%'} h={300}>
                    <Image h={300} src={lot.images[0]} alt={lot.title}/>
                </Center>
                <Stack w={'100%'} p={5} style={{position: "absolute"}}>
                    <Group h={30} justify={'space-between'}>
                        <Group/>
                    </Group>
                    <Flex h={240} direction={'column'} justify={'flex-end'}>
                        {helpers.getPastBidLotBanner(lot, lot.event, user_bids, 0.8)}
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
                <Group/>


                {/*<Button onClick={() => router.push(`/UpcomingAuctions/${auction.id}/Lots/${lot.id}`)}>*/}
                {/*    View*/}
                {/*</Button>*/}
            </Group>

        </Card>

    )
}