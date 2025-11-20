import {ActionIcon, Button, em, Group, Modal, ScrollArea, Text} from "@mantine/core";
import {IconArrowBigDownFilled, IconArrowBigUpFilled, IconFilterEdit, IconStarFilled} from "@tabler/icons-react";
import LotsFilterBar from "./LotsFilterBar";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAtom} from "jotai/index";
import {liveAuctionsAtom} from "../../src/atoms/auctionAtoms";
import {
    outbidLotsAtom,
    outbidLotsCountAtom,
    watchedLotsAtom,
    watchedLotsCountAtom,
    winningLotsAtom,
    winningLotsCountAtom
} from "../../src/atoms/lotsAtoms";
import {Lot} from "../../lib/types";
import LotsView from "../lot/LotsView";
import {useMediaQuery} from "@mantine/hooks";

export default function LotPageHeaderRibbon() {
    const router = useRouter();
    const {id} = router.query;
    const [auctions,] = useAtom(liveAuctionsAtom)
    const auction = auctions[parseInt(id?.toString() ?? '')]
    const [outbidLotsCount,] = useAtom(outbidLotsCountAtom)
    const [winningLotsCount,] = useAtom(winningLotsCountAtom)
    const [watchedLotsCount,] = useAtom(watchedLotsCountAtom)

    const [openFiltersModal, setOpenFiltersModal] = useState(false)
    const [selectedLots, setSelectedLots] = useState<Lot[]>([])
    const [quickAccessModalTitle, setQuickAccessModalTitle] = useState('')
    const [showQuickAccessModal, setShowQuickAccessModal] = useState(false)
    const [outbidLots,] = useAtom(outbidLotsAtom)
    const [winningLots,] = useAtom(winningLotsAtom)
    const [watchedLots,] = useAtom(watchedLotsAtom)
    const [activeFunction, setActiveFunction] = useState('')
    const isMobile = useMediaQuery(`(max-width: ${em(1000)})`);


    useEffect(() => {
        switch (activeFunction) {
            case 'outbid':
                setSelectedLots(outbidLots(auction?.id))
                break;
            case 'winning':
                setSelectedLots(winningLots(auction?.id))
                break;
            case 'watched':
                setSelectedLots(watchedLots(auction?.id))
                break;
        }
    }, [outbidLotsCount(auction?.id), winningLotsCount(auction?.id), watchedLotsCount(auction?.id)]);

    return (
        <Group justify={'flex-end'} pr={20}>
            <ActionIcon onClick={() => {
                setSelectedLots(winningLots(auction?.id))
                setQuickAccessModalTitle('Winning Lots')
                setShowQuickAccessModal(true)
                setActiveFunction('winning')
            }} size={'xl'} variant="transparent" aria-label="Settings">
                <IconArrowBigUpFilled color={'#00A4E8'} size={20} stroke={1.5}/>
                <Text c={'dimmed'} fw={600} fz={14}>{winningLotsCount(auction?.id)}</Text>
            </ActionIcon>
            <ActionIcon onClick={() => {
                setSelectedLots(outbidLots(auction?.id))
                setQuickAccessModalTitle('Outbid Lots')
                setShowQuickAccessModal(true)
                setActiveFunction('outbid')
            }} size={'xl'} variant="transparent" aria-label="Settings">
                <IconArrowBigDownFilled color={'#B1001E'} size={20} stroke={1.5}/>
                <Text c={'dimmed'} fw={600} fz={14}>{outbidLotsCount(auction?.id)}</Text>
            </ActionIcon>
            <ActionIcon onClick={() => {
                setSelectedLots(watchedLots(auction?.id))
                setQuickAccessModalTitle('Watched Lots')
                setShowQuickAccessModal(true)
                setActiveFunction('watched')
            }} size={'xl'} variant="transparent" aria-label="Settings">
                <IconStarFilled color={'orange'} size={20} stroke={1.5}/>
                <Text c={'dimmed'} fw={600} fz={14}>{watchedLotsCount(auction?.id)}</Text>
            </ActionIcon>
            <ActionIcon hiddenFrom={'md'} radius={'xl'} onClick={() => {
                setOpenFiltersModal(true)
            }} size={'xl'} variant="filled" aria-label="Settings">
                <IconFilterEdit size={20} stroke={1.5}/>
            </ActionIcon>
            <Modal title={'Filters'} opened={openFiltersModal} onClose={() => {
                setOpenFiltersModal(false)
            }}>
                <ScrollArea>
                    <LotsFilterBar auction={auction}/>

                </ScrollArea>
                <Group justify={'flex-end'}>
                    <Button onClick={() => setOpenFiltersModal(false)} mt={20}>Close</Button>
                </Group>
            </Modal>

            <Modal size={'100%'} title={quickAccessModalTitle} opened={showQuickAccessModal}
                   onClose={() => setShowQuickAccessModal(false)}>
                <LotsView span={{base: 12, sm: 6, lg: 4}} lots={selectedLots}/>
            </Modal>

        </Group>
    );
}