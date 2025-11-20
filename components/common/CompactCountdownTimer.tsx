import {Badge, Center, Stack, Text} from "@mantine/core";
import {ReactElement, useEffect, useState} from "react";


const getBadge = (value: number, label?: string) => {
    return <Stack>
        <Center>
            <Badge h={45} miw={45} variant="outline" size="12" radius={"xs"}>{value}</Badge>
        </Center>
        <Center>
            <Text c={'dimmed'} fz={"xs"} mt={-15}>{label}</Text>
        </Center>
    </Stack>;
}

export default function CompactCountdownTimer({timestamp, completedComponent, onComplete}: {
    timestamp: number,
    completedComponent: ReactElement,
    onComplete?: () => void
}) {
    const dayjs = require('dayjs-with-plugins');
    const [timeLeft, setTimeLeft] = useState(dayjs(timestamp).diff(dayjs()));
    const [label, setLabel] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const diff = dayjs(timestamp).diff(dayjs());
            setTimeLeft(diff);
            const duration = dayjs.duration(diff);
            const days = duration.days();
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            let result = '';
            if (days > 0) {
                result = `${days}D`;
            }
            if (hours > 0) {
                result = `${result} ${hours}H`;
            }
            result = `${result} ${minutes}M ${seconds}S`;

            setLabel(result.trim());

            if (diff <= 0) {
                clearInterval(interval);
                if (onComplete) {
                    onComplete();
                }
            }


        }, 1000);


        return () => clearInterval(interval);
    }, [timestamp]);


    if (timeLeft <= 0) {
        return <></>
    }

    return (
        <Badge color="red" variant={'filled'} size={'lg'} radius={5}>{label}</Badge>
    );
}