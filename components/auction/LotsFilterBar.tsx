import {Auction} from "../../lib/types";
import {Button, Group, MultiSelect, Pagination, Paper, Radio, Select, Stack, Text, TextInput} from "@mantine/core";
import {useAtom} from "jotai";
import {
    filtersAtom,
    updateCategoriesAtom,
    updateJumpToLotAtom,
    updateMyBidsAtom,
    updatePageAtom,
    updatePerPageAtom,
    updateSearchAtom,
    updateTotalPagesAtom,
    updateWatchedAtom
} from "../../src/atoms/filterAtoms";
import {lotsAtom, lotsCountByAuctionAtom} from "../../src/atoms/lotsAtoms";
import {useRouter} from "next/router";
import {notifications} from "@mantine/notifications";
import {IconX} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {isAuthenticatedAtom} from "../../src/atoms/authAtoms";


export default function LotsFilterBar({auction, isWatched}: { auction: Auction, isWatched?: boolean }) {
    const [filters, setFilters] = useAtom(filtersAtom);
    const [, updateSearch] = useAtom(updateSearchAtom);
    const [, updateWatched] = useAtom(updateWatchedAtom);
    const [, updateMyBids] = useAtom(updateMyBidsAtom);
    const [, updatePerPage] = useAtom(updatePerPageAtom);
    const [, updateJumpToLot] = useAtom(updateJumpToLotAtom);
    const [, updatePage] = useAtom(updatePageAtom);
    const [, updateCategories] = useAtom(updateCategoriesAtom);
    const [, updateTotalPages] = useAtom(updateTotalPagesAtom);
    const [lotsCount,] = useAtom(lotsCountByAuctionAtom)
    const [isAuthenticated,] = useAtom(isAuthenticatedAtom)
    const router = useRouter()
    const [lots] = useAtom(lotsAtom);
    const [searchPhrase, setSearchPhrase] = useState(filters.search)
    const [totalPages, setTotalPages] = useState<number>(Math.ceil(lotsCount(auction.id) / filters.perPage))


    useEffect(() => {
        setTotalPages(Math.ceil(lotsCount(auction.id) / filters.perPage))
    }, [filters.perPage]);

    useEffect(() => {
        updateTotalPages(totalPages)
    }, [totalPages]);

    useEffect(() => {
        updateTotalPages(totalPages)
    }, []);

    useEffect(() => {
        switch (router.pathname) {
            case '/MyBids':
            case '/MyBids/[id]/Lots':
                updateMyBids('bid')
                break;
            case  '/UpcomingAuctions':
            case '/UpcomingAuctions/[id]/Lots':
                updateMyBids('all')
                break;
        }
    }, [router.pathname]);


    useEffect(() => {
        //if the page is to high set it to max
        if (totalPages < filters.page) {
            updatePage(1)
        }
    }, [filters.page]);


    const handleJumpToLot = () => {

        const searchKey = filters.jumpToLot.replace(/\s+/g, '').toLowerCase();

        const auctionLots = lots[auction.id] || {};
        for (const lot of Object.values(auctionLots)) {
            const combinedLotNumber = `${lot.lotnumber}${lot.lotnumberext}`.replace(/\s+/g, '').toLowerCase();
            if (combinedLotNumber === searchKey) {
                return router.push(`/UpcomingAuctions/${auction.id}/Lots/${lot.id}`)
            }
        }

        notifications.show({
            title: 'Lot Not Found',
            message: `Lot #${filters.jumpToLot} not found`,
            color: 'red',
            icon: <IconX/>
        })
    }

    return (
        <Stack>
            {
                isAuthenticated && <Paper p={10} shadow={'none'} withBorder>
                    <Stack>
                        <Text c={'primary.9'} fw={700} fz={14}>Lots</Text>
                        <Radio.Group
                            value={filters.watched}
                            onChange={(value) => updateWatched(value)}
                        >
                            <Group mt="xs">
                                <Radio value="all" label="All"/>
                                <Radio value="watched" label="Watched"/>
                                <Radio value="unwatched" label="Unwatched"/>
                            </Group>
                        </Radio.Group>
                    </Stack>
                </Paper>
            }

            <Paper p={10} shadow={'none'} withBorder>
                <Text c={'primary.9'} fw={700} fz={14}>Page</Text>
                <Pagination size={'xs'}
                            total={totalPages}
                            value={filters.page}
                            onChange={(page) => updatePage(page)}/>
            </Paper>

            <Paper p={10} shadow={'none'} withBorder>
                <Text c={'primary.9'} fw={700} fz={14}>Lots Per Page</Text>
                <Group p={5}>
                    <Select
                        placeholder="Pick value"
                        data={[{label: '10', value: '10'}, {label: '20', value: '20'}, {
                            label: '40',
                            value: '40'
                        }, {label: '90', value: '90'}, {label: 'All', value: '5000'}]}
                        value={filters.perPage.toString()}
                        onChange={(value) => updatePerPage(parseInt(value ?? ''))}
                    />
                </Group>
            </Paper>
            <Paper p={10} shadow={'none'} withBorder>
                <Text c={'primary.9'} fw={700} fz={14}>Search</Text>
                <Group p={5}>
                    <TextInput w={120} placeholder={'Search Lots'} value={searchPhrase}
                               onChange={(event) => {
                                   setSearchPhrase(event.currentTarget.value)
                               }}/>
                    <Button onClick={() => {
                        updateSearch(searchPhrase)
                        //reset page when we pick categories
                        updatePage(1)
                    }}>Search</Button>
                </Group>
            </Paper>
            <Paper p={10} shadow={'none'} withBorder>
                <Text c={'primary.9'} fw={700} fz={14}>Jump To Lot</Text>
                <Group p={5}>
                    <TextInput w={120} placeholder={'Lots #'} value={filters.jumpToLot}
                               onChange={(event) => {
                                   updateJumpToLot(event.currentTarget.value)
                               }
                               }/>
                    <Button onClick={() => {
                        handleJumpToLot()
                    }}>Go</Button>
                </Group>
            </Paper>
            <Paper p={10} shadow={'none'} withBorder>
                <Text c={'primary.9'} fw={700} fz={14}>Categories</Text>
                <MultiSelect
                    onChange={(value) => {
                        updateCategories(value)
                        //reset page when we pick categories
                        updatePage(1)
                    }}
                    value={(filters.categories as string[])}
                    placeholder="Pick value"
                    data={auction?.categories?.map((category) => ({
                        value: category.id.toString(),
                        label: category.name
                    }))}
                />
            </Paper>
        </Stack>
    )
}