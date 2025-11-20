import {Auction, Lot} from "../../lib/types";
import {useEffect, useState} from "react";
import {placeBid} from "../../src/api";
import {Button, Modal, Select, Stack, Text} from "@mantine/core";
import {modals} from "@mantine/modals";
import {notifications} from "@mantine/notifications";
import {IconCheck} from "@tabler/icons-react";
import AuctionRegistrationForm from "../auction/AuctionRegistrationForm";
import helpers from "../../src/utils/helpers";
import {useAtom} from "jotai";
import {updateLotAtom} from "../../src/atoms/lotsAtoms";

export default function SelectBidView({lot, auction, close}: { lot: Lot, auction: Auction, close?: () => void }) {
    const [selectedAmount, setSelectedAmount] = useState<string | null>('')
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [priceList, setPriceList] = useState<number[]>([]);
    const [, updateLot] = useAtom(updateLotAtom);

    useEffect(() => {
        setSelectedAmount(null)
        setPriceList(helpers.createBidPriceList(auction.increments, 0, lot));
    }, [lot.id, lot.cbid]);


    const confirm = () => modals.openConfirmModal({
        title: 'Confirm your Bid.',
        children: (
            <Text size="sm">
                Your Bid : R {selectedAmount}
            </Text>
        ),
        labels: {confirm: 'Confirm', cancel: 'Cancel'},
        onCancel: () => console.log('Cancel'),
        onConfirm: () => {
            placeBid(lot.id, selectedAmount ?? 0)
                .then((r) => {

                    if (r?.data) {
                        updateLot({auctionId: lot.auctionid, updatedLot: r.data})
                    }

                    if (close) close();
                    notifications.show({
                        title: 'Bid Placed',
                        message: 'Your bid has been placed successfully.',
                        color: 'teal',
                        icon: <IconCheck/>
                    })
                })
        },
    });

    return (<>
            {
                auction.is_auction_registered ?
                    <Stack>
                        <Text fz={15} fw={600} c={'red'}>Select Your Bid</Text>
                        <Select
                            value={selectedAmount}
                            onChange={setSelectedAmount}
                            placeholder={'Amount'}
                            data={
                                priceList.map(
                                    (price) => ({value: price.toString(), label: `R ${price}`})
                                )
                            }

                        />
                        <Button disabled={!selectedAmount} onClick={confirm}>SUBMIT</Button>

                    </Stack> : <Button onClick={() => setShowRegistrationModal(true)}>Register To Bid</Button>
            }
            <Modal size={800}
                   title={<Text fw={700} fz={15}>{auction.auction_type} | {auction.title}</Text>}
                   opened={showRegistrationModal}
                   onClose={() => setShowRegistrationModal(false)}>
                <AuctionRegistrationForm auction={auction} close={() => setShowRegistrationModal(false)}/>
            </Modal>
        </>
    );
}