export interface LoginRequest {
    username: string;
    password: string;
    device_name: string;
    device: string;
}

export interface LoginResponse {
    status: string; // e.g., "success"
    login: boolean; // e.g., true
    token: string;  // The authentication token
}

export interface UserProfile {
    user_id: number;
    first_name: string;
    last_name: string;
    address: string;
    phone: string | null;
    title: string | null;
    companyname: string | null;
    fax: string | null;
    created_at: string;
    updated_at: string;
    country_id: number;
    state: string;
    zipcode: string;
    address_two: string;
    city: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    status: string;
    avatar: string;
    is_email_verified: boolean;
    created_at: string;
    updated_at: string;
    profile: UserProfile;
}


// Auction data shared across multiple endpoints
export interface Auction {
    id: number;
    title: string;
    auction_number: string;
    auction_type: string;
    starts: string; // ISO date
    ends: string;   // ISO date
    currency_type: string;
    image: string;
    description: string;
    location: string;
    location_description: string;
    viewing: string;
    minute: number | null;
    secounds: number | null;
    eventstatus: string;
    anti_minute: number | null;
    anti_secounds: number | null;
    is_auction_registered: boolean;
    auction_registration_status?: string;
    lots: number;
    is_past: boolean;
    categories: Category[];
    increments: AuctionIncrement[];
}

export interface AuctionIncrement {
    to: number;
    from: number;
    increment: number;
}

export interface BidResponse {
    success: string;
    data: Lot;
}


// Lot data shared across multiple endpoints
export interface Lot {
    id: number;
    title: string;
    ref_id: string;
    category_id: number | null;
    categoryName?: string; // Only in getLotById
    year: string;
    status: string;
    description: string;
    lotnumber: number;
    lotnumberext: string;
    startingprice: number;
    soldprice: number;
    auctionid: number;
    currentbid: string;
    end_time: string; // ISO date
    cbid: number;
    max_bid: number | null;
    image: string[];
    images: string[];
    is_watched: boolean;
    NumberOfBids: number;
    model: string;
    mileage: string;
    engine_number: string;
    vin_number: string;
    event_start_time: string; // ISO date
    lot_status: string;
    lot_status_color: string;
    Fieldtype?: string; // Optional, only in past auctions
    FieldName?: string; // Optional, only in past auctions
    FieldValue?: string; // Optional, only in past auctions
    vehical_number?: string; // Only in getLotById
    conditions?: string | null; // Only in getLotById
    video?: string; // Only in getLotById
    other?: string; // Only in getLotById
    hour?: string; // Only in getLotById
    is_winner?: boolean; // Only in getLotById
    user_bids?: number; // Only in getLotById
    has_your_bid: boolean;
    event?: Auction;
}

export interface Category {
    id: number;
    name: string;
}


export interface AppState {
    currentPage: string;
}

export interface AuctionRegistration {
    first_name: string;
    last_name: string;
    company_name?: string;
    phone: string;
    address: string;
    address2?: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
    t_c: boolean;
    age: boolean;
}


export interface LotUpdate {
    id: number;
    title: string;
    ref_id: string;
    category_id: number;
    year: string;
    status: string;
    description: string;
    lotnumber: number;
    lotnumberext: string;
    startingprice: number;
    soldprice: number;
    auctionid: number;
    currentbid: string;
    end_time: string;
    cbid: number;
    max_bid: number;
    image: string[];
    is_watched: boolean;
    NumberOfBids: number;
    model: string;
    mileage: string;
    engine_number: string;
    vin_number: string;
    event_start_time: string;
    lot_status: string;
    lot_status_color: string;
    Fieldtype: string;
    FieldName: string;
    FieldValue: string | null;
}


export interface LotDetailResponse {
    is_auction_registered: boolean;
    current_bid: number;
    pricelist: number[];
    is_outbid: boolean;
    auction: Auction;
    Auctionstatus: string;
    lot: Lot;
    lotUpdates: LotUpdate[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    customfieldname: string;
    customfield_type: string;
    customfield_values: string[];
    created_at: string;
    updated_at: string;
}

export interface Banner {
    // Define the properties of a banner if known
}


export interface LandingSettings {
    banners: Banner[];
    landing_type: {
        slug: string;
        value: string;
        created_at: string | null;
        updated_at: string;
    };
    auction_video_url: {
        slug: string;
        value: string;
        created_at: string | null;
        updated_at: string;
    };
}