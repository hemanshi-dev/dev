import {Icon, IconAlarmPlus, IconChevronDown, IconHistory, IconLink, IconUser,} from '@tabler/icons-react';
import {
    Box,
    Burger,
    Button,
    Center,
    Divider,
    Drawer,
    Group,
    HoverCard,
    Image,
    Modal,
    ScrollArea,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import classes from './header.module.css';
import Link from "next/link";
import {useAtom} from "jotai";
import {userAtom} from "../../src/atoms/userAtoms";
import {UserMenu} from "./UserMenu";
import {configurationAtom, pageTitleAtom} from "../../src/atoms/stateAtoms";
import {useRouter} from 'next/router';
import {HeaderRibbon} from "./HeaderRibbon";
import {isAuthenticatedAtom} from "../../src/atoms/authAtoms";
import {useSignOut} from "../../src/hooks/useSignOut";
import {useEffect, useState} from "react";
import SignUpForm from "../common/SignUpForm";

interface LinkProps {
    icon: Icon;
    title: string;
    description: string;
    url?: string;
}

const AuctionLinks: LinkProps[] = [
    {
        icon: IconAlarmPlus,
        title: 'Upcoming auctions',
        description: 'View all upcoming auctions.',
        url: '/UpcomingAuctions'
    },
    {
        icon: IconHistory,
        title: 'Past auctions',
        description: 'View all past auctions.',
        url: '/PastAuctions'
    },

];

const MoreLinks: LinkProps[] = [
    {
        icon: IconLink,
        title: 'About Us',
        description: 'About Us.',
        url: 'https://devcoauctioneers.co.za/about/'
    },
    {
        icon: IconLink,
        title: 'Conditions of Sale',
        description: 'Conditions of Sale.',
        url: 'https://devcoauctioneers.co.za/about/conditions-of-sale/'
    },
    {
        icon: IconLink,
        title: 'Terms of Use',
        description: 'Terms of Use.',
        url: 'https://devcoauctioneers.co.za/about/terms-of-use/'
    },
    {
        icon: IconLink,
        title: 'Privacy Policy',
        description: 'Privacy Policy.',
        url: 'https://devcoauctioneers.co.za/about/privacy-policy/'
    },
    {
        icon: IconLink,
        title: 'FAQ',
        description: 'FAQ.',
        url: 'https://devcoauctioneers.co.za/faq/'
    },

];

const BidsLinks: LinkProps[] = [
    {
        icon: IconAlarmPlus,
        title: 'Upcoming bids',
        description: 'View all you bids from upcoming auctions.',
        url: '/MyBids'
    },
    {
        icon: IconHistory,
        title: 'Past bids',
        description: 'View all your bids from past auctions.',
        url: '/PastBids'
    },

];

export function CustomHeader() {
    const [user] = useAtom(userAtom)
    const [pageTitle] = useAtom(pageTitleAtom)
    const [isAuthenticated,] = useAtom(isAuthenticatedAtom)

    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);
    const [linksOpened, {toggle: toggleLinks}] = useDisclosure(false);
    const theme = useMantineTheme();

    const [configuration] = useAtom(configurationAtom);

    const router = useRouter();

    const [showSignUpModal, setShowSignUpModal] = useState(false)

    useEffect(() => {
        closeDrawer();
    }, [router.pathname]);
    const getLinks = (links: LinkProps[], newTab: boolean = false) => {
        return links.map((item) => (
            <UnstyledButton onClick={() => {
                if (item.url) {
                    if (newTab) {
                        window.open(item.url, '_blank');
                    } else {
                        router.push(item.url);
                    }
                }
            }} className={classes.subLink} key={item.title}>
                <Group wrap="nowrap" align="flex-start">
                    <ThemeIcon size={34} variant="default" radius="md">
                        <item.icon size={22} color={theme.colors.blue[6]}/>
                    </ThemeIcon>
                    <div>
                        <Text size="sm" fw={500}>
                            {item.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {item.description}
                        </Text>
                    </div>
                </Group>
            </UnstyledButton>
        ));
    }

    const signOut = useSignOut();

    const handleLogout = () => {
        signOut(); // Perform sign-out
        window.location.href = '/auth/Login'; // Redirect to login page
    };

    return (
        <Stack>
            <Box>
                <header className={classes.header}>
                    <Group justify="space-between" h="100%">
                        <Image height={configuration.navMenuHeight - 2} src='/logo.png' alt="Logo"
                               className={classes.logo}/>

                        <Group h="100%" gap={0} visibleFrom="sm">
                            <Link href="/UpcomingAuctions" className={classes.link}>
                                Home
                            </Link>
                            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                                <HoverCard.Target>
                                    <a href="#" className={classes.link}>
                                        <Center inline>
                                            <Box component="span" mr={5}>
                                                Auctions
                                            </Box>
                                            <IconChevronDown size={16} color={theme.colors.blue[6]}/>
                                        </Center>
                                    </a>
                                </HoverCard.Target>

                                <HoverCard.Dropdown style={{overflow: 'hidden'}}>
                                    <SimpleGrid cols={2} spacing={0}>
                                        {getLinks(AuctionLinks)}
                                    </SimpleGrid>
                                </HoverCard.Dropdown>
                            </HoverCard>
                            {
                                isAuthenticated &&
                                <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                                    <HoverCard.Target>
                                        <a href="#" className={classes.link}>
                                            <Center inline>
                                                <Box component="span" mr={5}>
                                                    My Bids
                                                </Box>
                                                <IconChevronDown size={16} color={theme.colors.blue[6]}/>
                                            </Center>
                                        </a>
                                    </HoverCard.Target>

                                    <HoverCard.Dropdown style={{overflow: 'hidden'}}>
                                        <SimpleGrid cols={2} spacing={0}>
                                            {getLinks(BidsLinks)}
                                        </SimpleGrid>
                                    </HoverCard.Dropdown>
                                </HoverCard>

                            }


                            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                                <HoverCard.Target>
                                    <a href="#" className={classes.link}>
                                        <Center inline>
                                            <Box component="span" mr={5}>
                                                More
                                            </Box>
                                            <IconChevronDown size={16} color={theme.colors.blue[6]}/>
                                        </Center>
                                    </a>
                                </HoverCard.Target>

                                <HoverCard.Dropdown style={{overflow: 'hidden'}}>
                                    <SimpleGrid cols={2} spacing={0}>
                                        {getLinks(MoreLinks, true)}
                                    </SimpleGrid>
                                </HoverCard.Dropdown>
                            </HoverCard>


                        </Group>

                        {
                            !user ? <Group visibleFrom="sm">
                                    <Link href="/auth/Login" passHref>
                                        <Button variant="default">Log in</Button>
                                    </Link>
                                    <Button onClick={() => {
                                        setShowSignUpModal(true)
                                        closeDrawer()
                                    }}>Sign up</Button>

                                </Group> :
                                <UserMenu/>
                        }


                        <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm"/>
                    </Group>
                </header>

                <Drawer
                    opened={drawerOpened}
                    onClose={closeDrawer}
                    size="100%"
                    padding="md"
                    title={
                        <Group>
                            <Image pos={"absolute"} w={60} src='/logo.png' alt="Logo"/>
                            <Text c={'dimmed'} fw={650} ml={80}>Devco V2</Text>
                        </Group>
                    }
                    hiddenFrom="sm"
                    zIndex={1000000}
                >
                    <ScrollArea h="calc(100vh - 80px" mx="-md">
                        <Divider my="sm"/>

                        <Link href="/UpcomingAuctions" className={classes.link}>
                            Upcoming Auctions
                        </Link>
                        <Link href="/PastAuctions" className={classes.link}>
                            Past Auctions
                        </Link>
                        <Link href="/MyBids" className={classes.link}>
                            My Bids
                        </Link>
                        <Link href="/PastAuctions" className={classes.link}>
                            Past Bids
                        </Link>

                        <Divider my="sm"/>

                        <Link href="https://devcoauctioneers.co.za/about/" className={classes.link}>
                            About Us
                        </Link>
                        <Link href="https://devcoauctioneers.co.za/about/conditions-of-sale/" className={classes.link}>
                            Conditions of Sale
                        </Link>
                        <Link href="https://devcoauctioneers.co.za/about/terms-of-use/" className={classes.link}>
                            Terms of Use
                        </Link>
                        <Link href="https://devcoauctioneers.co.za/about/privacy-policy/" className={classes.link}>
                            Privacy Policy
                        </Link>
                        <Link href="https://devcoauctioneers.co.za/faq/" className={classes.link}>
                            FAQ
                        </Link>

                        <Divider my="sm"/>


                        {
                            !user ? <Group p={10} hiddenFrom="md">
                                    <Link href="/auth/Login" passHref>
                                        <Button variant="default">Log in</Button>
                                    </Link>
                                    <Button onClick={() => {
                                        setShowSignUpModal(true)
                                        closeDrawer()
                                    }}>Sign up</Button>

                                </Group> :
                                <Stack>
                                    <Group p={10} justify={'space-between'}>
                                        <Button leftSection={<IconUser/>}
                                                variant={"transparent"}>{user.username}</Button>
                                        <Button onClick={handleLogout}>Sign Out</Button>
                                    </Group>
                                </Stack>
                        }

                        <Group justify={'flex-start'}>
                            <Image onClick={() => {
                                window.open('https://play.google.com/store/apps/details?id=online.devco&hl=en&gl=US', '_blank')
                            }} w={140} src={'/playstore.png'} alt={'logo'}/>
                            <Image
                                onClick={() => {
                                    window.open('https://apps.apple.com/za/app/devco-online/id6449440793', '_blank')
                                }}
                                h={50} src={'/applestore.png'} alt={'logo'}/>
                        </Group>

                    </ScrollArea>
                </Drawer>
                <Modal title={'Sign Up'} opened={showSignUpModal} onClose={() => setShowSignUpModal(false)}>
                    <SignUpForm/>
                </Modal>
            </Box>
            <Box pl={10} mt={-17} bg="gray.2" h={80}>
                <HeaderRibbon/>
            </Box>
        </Stack>

    );
}