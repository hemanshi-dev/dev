import {Auction, AuctionIncrement, Lot} from "../../lib/types";
import {Badge} from "@mantine/core";

const getLotBanner = (lot?: Lot | null, auction?: Auction | null, user_bids?: any, opacity?: number) => {
    if (!lot || !auction) return <></>;


    if (lot.is_winner === undefined || lot.NumberOfBids === 0 || user_bids === undefined || user_bids === 0) {
        return createBanner(lot.lot_status_color, `${lot.lot_status} | ${auction?.currency_type ?? 'R'}${lot.startingprice}`, opacity)
    } else if (lot.is_winner) {
        return createBanner(lot.lot_status_color, `${lot.lot_status} | ${auction?.currency_type ?? 'R'}${lot.cbid} - MAX | ${lot.max_bid}`, opacity)
    } else {
        return createBanner(lot.lot_status_color, `${lot.lot_status} | ${auction?.currency_type ?? 'R'}${lot.cbid} `, opacity)

    }

}

const getPastBidLotBanner = (lot?: Lot | null, auction?: Auction | null, user_bids?: any, opacity?: number) => {
    if (!lot || !auction) return <></>;


    if (lot.is_winner === true) {
        return createBanner('#3093C9', `WON STC | ${auction?.currency_type ?? 'R'}${lot.soldprice}`, opacity)
    } else {
        return createBanner('#A30100', `SOLD STC | ${auction?.currency_type ?? 'R'}${lot.soldprice}`, opacity)
    }

}

const createBanner = (color: string, label: string, opacity?: number) => {
    return <Badge opacity={opacity} bg={color} radius={0} size={"lg"} w={'100%'}>{label}</Badge>
}

const createBidPriceList = (
    incr: AuctionIncrement[],
    lastBidPrice1: number = 0,
    lot: Lot,
    numberOfOption: number = 100
): number[] => {
    const result: number[] = [lot.cbid];


    let incrementIndex =
        incr
            .findIndex(
                increment =>
                    result[0] <= parseInt(increment.from.toString()) &&
                    result[0] >= parseInt(increment.to.toString()));


    if (lot.NumberOfBids > 0)
        result[0] = result[0] + parseInt(incr[incrementIndex].increment.toString());

    for (let i = 1; i < numberOfOption; i++) {
        const max = parseInt(incr[incrementIndex].from.toString());
        const increment = parseInt(incr[incrementIndex].increment.toString());
        result[i] = result[i - 1] + increment;
        if (result[i] > max && incrementIndex < incr.length - 1) {
            incrementIndex++;
            result[i] = result[i - 1] + parseInt(incr[incrementIndex].increment.toString());
        }
        if (i > numberOfOption - 2) {
            break;
        }
    }

    return result;
}

export default {
    getLotBanner: getLotBanner,
    getPastBidLotBanner: getPastBidLotBanner,
    createBidPriceList: createBidPriceList
}