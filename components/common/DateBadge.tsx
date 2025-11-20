import dayjs from "dayjs";
import {Badge, Center, Grid, Paper, Stack, Text} from "@mantine/core";

export default function DateBadge(props: { color: string, date: dayjs.Dayjs, label?: string }) {
    return <Paper p={5} h={60} shadow={"none"} withBorder={!!props.label} radius={0}>
        <Grid>
            <Grid.Col span={props.label ? 5 : 12}>
                <Center>
                    <Badge size={"14"} w={65} h={48} radius={0}
                           color={props.color}>{props.date.format("DD")}</Badge>
                    <Badge size={"12"} w={70} h={48} radius={0}
                           color="gray.4">
                        <Stack>
                            <Text c={"gray.7"} fw={800}
                                  fz={15}>{props.date.format("MMM")}</Text>
                            <Text c={"gray.7"} mt={-20} fw={600}
                                  fz={12}>{props.date.format("YYYY")}</Text>
                        </Stack>
                    </Badge>
                </Center>

            </Grid.Col>
            {props.label &&
                <Grid.Col span={7}>
                    <Center h={50}>
                        <Text fw={800} fz={15} c={"gray.6"}>{props.label}</Text>
                    </Center>
                </Grid.Col>
            }

        </Grid>
    </Paper>;
}
