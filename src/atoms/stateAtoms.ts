import {atomWithStorage} from 'jotai/utils';
import React from "react";
import {LandingSettings} from "../../lib/types";

export const pageTitleAtom = atomWithStorage<string | null>('pageTitle', null);
export const configurationAtom = atomWithStorage<{
    navMenuHeight: number,
    menuRibbonHeight: number,
    footerHeight: number,
}>('configurationAtom', {
    navMenuHeight: 100,
    menuRibbonHeight: 80,
    footerHeight: 60,
});

export const landingSettingsAtom = atomWithStorage<LandingSettings>('landingSettings', {
    banners: [],
    landing_type: {
        slug: "landing_type",
        value: "video",
        created_at: null,
        updated_at: "2023-12-19T05:41:51.000000Z"
    },
    auction_video_url: {
        slug: "auction_video_url",
        value: "https://www.youtube.com/embed/PziGmzkz-sA",
        created_at: "2021-07-08T19:53:38.000000Z",
        updated_at: "2023-06-27T05:30:10.000000Z"
    }
});
export const headerRibbonAtom = atomWithStorage<React.ReactElement | null>('headerRibbon', null);