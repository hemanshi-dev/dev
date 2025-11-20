import {fetchLotById} from '../api';
import {useAtom} from "jotai";
import {updateLotAtom} from "../atoms/lotsAtoms";

export const useUpdateLot = (lotId: number) => {
    const [, updateLot] = useAtom(updateLotAtom);

    return () => {
        fetchLotById(lotId)
            .then((lot) => {
                if (lot) {
                    updateLot({auctionId: lot.auctionid, updatedLot: lot})
                }
            });
    }

};