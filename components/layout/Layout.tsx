import {AppShell, em, UnstyledButton} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {ReactNode, useEffect} from 'react';
import {useRouter} from 'next/router';
import classes from './layout.module.css';
import {CustomHeader} from './Header';
import {Footer} from "./Footer";
import {useAtom} from "jotai";
import {configurationAtom, landingSettingsAtom} from "../../src/atoms/stateAtoms";
import {getSettings} from "../../src/api";
import AuctionListener from '../../pages/AuctionListener';

interface LayoutProps {
    children: ReactNode;
}

const authRoutes = ['/auth/Login', '/auth/Signup']; // Add your authentication routes here

export function Layout({children}: LayoutProps) {
    const [opened, {toggle}] = useDisclosure();
    const router = useRouter();
    const isAuthRoute = authRoutes.includes(router.pathname);
    const [configuration, setConfigurations] = useAtom(configurationAtom);
    const isMobile = useMediaQuery(`(max-width: ${em(1000)})`);
    const [, updateLandingSettings] = useAtom(landingSettingsAtom)

    useEffect(() => {
        setConfigurations({
            ...configuration,
            footerHeight: isMobile ? 0 : 60
        })

    }, [isMobile]);
    useEffect(() => {
        getSettings().then((response) => {
            updateLandingSettings(response)
        })

    }, []);

    if (isAuthRoute) {
        return <>{children}</>;
    }


    return (
      <AppShell
        header={{
          height: configuration.navMenuHeight + configuration.menuRibbonHeight,
        }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: true, mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <CustomHeader />
        </AppShell.Header>

        <AppShell.Navbar py="md" px={4}>
          <UnstyledButton className={classes.control}>Home</UnstyledButton>
          <UnstyledButton className={classes.control}>Blog</UnstyledButton>
          <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
          <UnstyledButton className={classes.control}>Support</UnstyledButton>
        </AppShell.Navbar>

        <AppShell.Main>
          <AuctionListener />
          {children}
        </AppShell.Main>
        <AppShell.Footer visibleFrom={"md"}>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    );
}