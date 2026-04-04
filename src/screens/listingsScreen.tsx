import ListingBanner from "@/components/listings/banner.tsx";
import ListingComponent from "@/components/listings/listingComponent.tsx";
import {useEffect, useMemo, useState} from "react";
import {Button, Empty, Select, Tabs, Typography} from "antd";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchListingAsync} from "@/store/reducers/listingSlice.ts";
import type {CarItem} from "@/types";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";

const {Title, Text} = Typography;

type ListingTabKey = "popular" | "newly-listed";

const tabConfig: Array<{
    key: ListingTabKey;
    label: string;
    eyebrow: string;
    description: string;
}> = [
    {
        key: "popular",
        label: "Popular Listings",
        eyebrow: "High attention",
        description: "The listing inventory attracting the most views and saves right now.",
    },
    {
        key: "newly-listed",
        label: "Newly Listed",
        eyebrow: "Fresh arrivals",
        description: "Recently published vehicles that just hit the marketplace.",
    },
];

export default function ListingsScreen() {
    const dispatch = useAppDispatch();
    const {popularListings, newListings, listings, loading, error} = useAppSelector((state) => state.listing);
    const [activeTab, setActiveTab] = useState<ListingTabKey>("popular");
    const [yearRange, setYearRange] = useState<[string | null, string | null]>([null, null]);
    const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null);
    const [bodyStyleFilter, setBodyStyleFilter] = useState<string | null>(null);

    useEffect(() => {
        if (!listings.length) {
            dispatch(fetchListingAsync({page: 1, pageSize: 24}));
        }
    }, [dispatch, listings.length]);

    const sourceList = useMemo(() => {
        return activeTab === "popular" ? popularListings : newListings;
    }, [activeTab, newListings, popularListings]);

    const years = useMemo(() => {
        const set = new Set(sourceList.map((item: CarItem) => String(item.year)));
        return Array.from(set).sort((a, b) => Number(b) - Number(a));
    }, [sourceList]);

    const transmissions = useMemo(() => {
        const set = new Set(sourceList.map((item: CarItem) => item.transmission).filter(Boolean));
        return Array.from(set);
    }, [sourceList]);

    const bodyStyles = useMemo(() => {
        const set = new Set(sourceList.map((item: CarItem) => item.body).filter(Boolean));
        return Array.from(set);
    }, [sourceList]);

    const filteredListings = useMemo(() => {
        return sourceList.filter((listing: CarItem) => {
            const [startYear, endYear] = yearRange;
            const matchesYear = !startYear || !endYear || (listing.year >= Number(startYear) && listing.year <= Number(endYear));
            const matchesTransmission = !transmissionFilter || listing.transmission === transmissionFilter;
            const matchesBody = !bodyStyleFilter || listing.body === bodyStyleFilter;

            return matchesYear && matchesTransmission && matchesBody;
        });
    }, [bodyStyleFilter, sourceList, transmissionFilter, yearRange]);

    const activeTabMeta = tabConfig.find((tab) => tab.key === activeTab) ?? tabConfig[0];
    const hasFilters = Boolean(yearRange[0] || yearRange[1] || transmissionFilter || bodyStyleFilter);

    const resetFilters = () => {
        setYearRange([null, null]);
        setTransmissionFilter(null);
        setBodyStyleFilter(null);
    };

    if (loading && !popularListings.length && !newListings.length) {
        return <LoadingScreen/>;
    }

    return (
        <div className="pb-10">
            <ListingBanner/>
            <div className="px-4 py-6 lg:px-8 xl:px-12">
                <div className="mx-auto flex w-full flex-col gap-6">
                    <section>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                                <div className="max-w-3xl">
                                    <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                                        Listing Marketplace
                                    </Text>
                                    <Title className="mb-2! mt-3! leading-none text-black dark:text-white" level={2}>
                                        Browse ready-to-buy vehicles with cleaner signals.
                                    </Title>
                                    <Text className="block text-sm text-black/65 dark:text-white/70 md:text-base">
                                        Explore the most watched stock or scan the latest arrivals, then narrow the set by year, transmission, and body style.
                                    </Text>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                        <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                            Market Pool
                                        </Text>
                                        <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                            {sourceList.length}
                                        </Title>
                                    </div>
                                    <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                        <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                            Matching
                                        </Text>
                                        <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                            {filteredListings.length}
                                        </Title>
                                    </div>
                                    <div className="col-span-2 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5 sm:col-span-1">
                                        <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                            View
                                        </Text>
                                        <Text className="text-sm font-medium text-black dark:text-white">
                                            {activeTabMeta.label}
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <Tabs
                                activeKey={activeTab}
                                onChange={(key) => setActiveTab(key as ListingTabKey)}
                                items={tabConfig.map((tab) => ({key: tab.key, label: tab.label}))}
                            />

                            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                                <div className="rounded-2xl border border-black/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5 md:p-5">
                                    <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                        {activeTabMeta.eyebrow}
                                    </Text>
                                    <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                                        {activeTabMeta.label}
                                    </Title>
                                    <Text className="block text-sm text-black/65 dark:text-white/70">
                                        {activeTabMeta.description}
                                    </Text>
                                </div>

                                <div className="rounded-2xl border border-black/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5 md:p-5">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <Text className="mb-1! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                                Refine Results
                                            </Text>
                                            <Text className="text-sm text-black/65 dark:text-white/70">
                                                Filter the current listing set by year, transmission, and body style.
                                            </Text>
                                        </div>
                                        {hasFilters && (
                                            <Button type="text" onClick={resetFilters}>
                                                Reset
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <Select
                                            allowClear
                                            value={yearRange[0]}
                                            onChange={(value) => setYearRange([value ?? null, yearRange[1]])}
                                            placeholder="From Year"
                                            options={years.map((year) => ({value: year, label: year}))}
                                        />
                                        <Select
                                            allowClear
                                            value={yearRange[1]}
                                            onChange={(value) => setYearRange([yearRange[0], value ?? null])}
                                            placeholder="To Year"
                                            options={years.map((year) => ({value: year, label: year}))}
                                        />
                                        <Select
                                            allowClear
                                            value={transmissionFilter}
                                            onChange={(value) => setTransmissionFilter(value ?? null)}
                                            placeholder="Transmission"
                                            options={transmissions.map((value) => ({value, label: value}))}
                                        />
                                        <Select
                                            allowClear
                                            value={bodyStyleFilter}
                                            onChange={(value) => setBodyStyleFilter(value ?? null)}
                                            placeholder="Body Style"
                                            options={bodyStyles.map((value) => ({value, label: value}))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {error && <Text type="danger" className="block">{error}</Text>}

                    {!loading && !filteredListings.length ? (
                        <div className="rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 dark:border-white/10 dark:bg-white/5">
                            <Empty description="No listings match the current selection.">
                                {hasFilters && <Button onClick={resetFilters}>Clear filters</Button>}
                            </Empty>
                        </div>
                    ) : (
                        <section className="space-y-4">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <Title level={4} className="mb-0! text-black dark:text-white">
                                        Browse Results
                                    </Title>
                                    <Text className="text-sm text-black/60 dark:text-white/65">
                                        {filteredListings.length} vehicle{filteredListings.length === 1 ? "" : "s"} in {activeTabMeta.label.toLowerCase()}.
                                    </Text>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {filteredListings.map((listing: CarItem) => (
                                    <ListingComponent key={listing.id} listing={listing}/>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
