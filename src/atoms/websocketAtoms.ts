import {atom} from 'jotai';
import {atomWithStorage} from 'jotai/utils';
import {updateLotAtom} from "./lotsAtoms";
import {Lot} from "../../lib/types";

export const websocketAtom = atomWithStorage<WebSocket | null>('websocket', null);

export const handleWebSocketMessageAtom = atom(
    null,
    (get, set, message: { auctionId: number; updatedLot: Lot }) => {
        set(updateLotAtom, message);
    }
);