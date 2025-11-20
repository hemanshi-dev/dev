import apiClient from './axiosConfig';
import {Auction, AuctionRegistration, Category, LandingSettings} from "../../lib/types";

export const fetchLiveAuctions = async (): Promise<Auction[]> => {
    const response = await apiClient.get('/Auction/Upcomming');
    return response.data.data;
};

export const fetchAuthenticatedLiveAuctions = async (): Promise<Auction[]> => {
    const response = await apiClient.get('/upcoming-auctions');
    return response.data.data;
};

export const fetchPastAuctions = async () => {
    const response = await apiClient.get('/Auction/Past');
    return response.data.data;
};

export const registerToBid = async (auctionId: number, data: AuctionRegistration) => {
    const response = await apiClient.post(`/AuctionRegister/${auctionId}`, data);
    return response.data.data;
}
export const getAuction = async (auctionId: number): Promise<Auction> => {
    const response = await apiClient.get(`/Auction/${auctionId}`);
    return response.data.data;
}

export const getCategories = async (auctionId: number): Promise<Category[]> => {
    const response = await apiClient.get(`/Auction/categories/${auctionId}`);
    return response.data;
}


export const getSettings = async (): Promise<LandingSettings> => {
    const response = await apiClient.get(`/home_page_settings`);
    return response.data.data;
}
export const getVideo = async (): Promise<any> => {
    const response = await apiClient.get(`/auction_video_settings`);
    return response.data;
}
