import React, {useEffect} from 'react';
import Pusher, {Channel} from 'pusher-js';
import {useAtom} from "jotai";
import {getLiveLotByIdAtom, updateLotAtom} from "../../src/atoms/lotsAtoms";
import {userAtom} from "../../src/atoms/userAtoms";
import {notifications} from "@mantine/notifications";
import {IconArrowDown} from "@tabler/icons-react";

interface PusherHandlerProps {
    channelName: string;
    eventName: string;
}

interface Message {
    id: number;
    text: string;
}

interface BidChangedEvent {
    amount: string;
    auction_id: number;
    crnt_bid_usr_id: number;
    currency: string;
    endtime: string;
    event_id: number;
    extended_time: number;
    maxbid: string;
    newlotnumber: string;
    staggered: boolean;
    startingprice: string;
    type: string;
    users_with_bids: number[];
}

const PusherHandler: React.FC<PusherHandlerProps> = ({channelName, eventName}) => {
    const [getLot] = useAtom(getLiveLotByIdAtom);
    const [, updateLot] = useAtom(updateLotAtom);
    const [user,] = useAtom(userAtom);
    const handleNewMessage = (data: { data: string }) => {
        const event = JSON.parse(data.data) as BidChangedEvent;

        let lot = {...getLot(event.event_id, event.auction_id)};
        lot.end_time = event.endtime;
        lot.max_bid = parseInt(event.maxbid);
        lot.cbid = parseInt(event.amount);
        lot.is_winner = user?.id === event.crnt_bid_usr_id;

        if (!lot.is_winner && event.users_with_bids.includes(user?.id ?? -1)) {
            lot.lot_status = 'outbid';
            lot.lot_status_color = '#B1001E';
        } else if (!lot.is_winner && !event.users_with_bids.includes(user?.id ?? -1)) {
            lot.lot_status = 'Current Bid';
            lot.lot_status_color = '#00008B';
        }
        if (lot.is_winner) {
            lot.lot_status = 'winning';
            lot.lot_status_color = '#00A4E8';
        }

        updateLot({auctionId: lot.auctionid, updatedLot: lot})

        if (lot.lot_status == 'outbid') {
            notifications.show({
                title: 'Outbid',
                message: `You have been outbid on lot ${lot.title}. current bid is ${lot.cbid}.`,
                color: '#B1001E',
                icon: <IconArrowDown/>,
                withBorder: true
            })
        }

    };

    useEffect(() => {
        // Initialize Pusher
        const pusher = new Pusher('66506905f562c2ab3d60', {
            cluster: 'eu',
        });

        // Subscribe to the channel
        const channel: Channel = pusher.subscribe(channelName);

        // Bind to the event
        channel.bind(eventName, (data: any) => {
            handleNewMessage(data); // Pass data to the parent or other components
        });

        // Cleanup on unmount
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [channelName, eventName, handleNewMessage]);

    return null; // This component does not render anything
};

export default PusherHandler;
