import apiClient from './axiosConfig';
import {BidResponse, Lot, LotDetailResponse} from "../../lib/types";

export const fetchLotsForAuction = async (auctionId: number, page?: number, perPage?: number, authenticated = false) => {
    const top = perPage ?? 10;
    const skip = ((page ?? 1) - 1) * top;
    const response = await apiClient.get(`/Auction/Lots/${auctionId}${authenticated ? '/Authenticated' : ''}?top=${top}&skip=${(skip)}`);
    return response.data.data.lots;
};


export const fetchLotById = async (lotId: number): Promise<Lot> => {
    const response = await apiClient.get(`/Auction/lot/${lotId}`);
    return response.data.data;
};

export const fetchLotDetails = async (lotRef: string): Promise<LotDetailResponse> => {
    const response = await apiClient.get(`/Lot/detail/${lotRef}`);
    return response.data.data;
};

export const watchLot = async (lotRef: string) => {
    const response = await apiClient.post(`/lot/watch`, {ref_id: lotRef});
    return response.data.data;
}
export const unWatchLot = async (lotRef: string) => {
    const response = await apiClient.delete(`/lot/unwatch?ref_id=${lotRef}`);
    return response.data.data;
}

export const placeBid = async (lotId: number | string, amount: number | string): Promise<BidResponse> => {
    const response = await apiClient.post(`/PlaceBid/${lotId}`, {amount: amount, lotId: lotId, source: 'Web'});
    return response?.data;
}

export const getPastBids = async (status: string, page: number, perPage: number): Promise<{
    lots: any[];
    pagination: {
        total: number;
        top: number;
        skip: number;
    };
}> => {
    const top = perPage;
    const skip = ((page ?? 1) - 1) * top;
    const response = await apiClient.get(`/Bid/Past?top=${top}&skip=${skip}&won=${status}`);

    return response.data.data;
}


