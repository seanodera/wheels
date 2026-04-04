import {useEffect, useMemo, useState} from "react";
import {Button, Empty, Select, Tabs, Typography} from "antd";
import AuctionBanner from "@/components/auction/banner.tsx";
import AuctionItem from "@/components/auction/auctionItem.tsx";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchAuctionsAsync} from "@/store/reducers/auctionSlice.ts";
import type {CarAuction} from "@/types";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";

const {Title, Text} = Typography;

type AuctionTabKey = "ending-soon" | "newly-listed" | "no-reserve" | "lowest-mileage" | "inspected";

const tabConfig: Array<{
    key: AuctionTabKey;
    label: string;
    eyebrow: string;
    description: string;
}> = [
    {
        key: "ending-soon",
        label: "Ending Soon",
        eyebrow: "Time sensitive",
        description: "Auctions closing soonest so you can act before the window narrows.",
    },
    {
        key: "newly-listed",
        label: "Newly Listed",
        eyebrow: "Fresh arrivals",
        description: "The latest auction inventory added to the marketplace.",
    },
    {
        key: "no-reserve",
        label: "No Reserve",
        eyebrow: "Open opportunity",
        description: "Vehicles where the highest bid wins without a reserve threshold.",
    },
    {
        key: "lowest-mileage",
        label: "Lowest Mileage",
        eyebrow: "Lightly driven",
        description: "Auction units with the leanest odometer readings in the pool.",
    },
    {
        key: "inspected",
        label: "Inspected",
        eyebrow: "Checked stock",
        description: "Vehicles highlighted for added confidence during evaluation.",
    },
];

export default function AuctionsScreen() {
    const dispatch = useAppDispatch();
    const {
        loading,
        error,
        endingSoon,
        newlyListed,
        noReserve,
        lowestMileage,
        inspected
    } = useAppSelector((state) => state.auction as {
        loading: boolean;
        error: string | null;
        endingSoon: CarAuction[];
        newlyListed: CarAuction[];
        noReserve: CarAuction[];
        lowestMileage: CarAuction[];
        inspected: CarAuction[];
    });
    const [activeTab, setActiveTab] = useState<AuctionTabKey>("ending-soon");
    const [yearRange, setYearRange] = useState<[string | null, string | null]>([null, null]);
    const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null);
    const [bodyStyleFilter, setBodyStyleFilter] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchAuctionsAsync());
    }, [dispatch]);

    const sourceList = useMemo(() => {
        switch (activeTab) {
            case "ending-soon":
                return endingSoon;
            case "newly-listed":
                return newlyListed;
            case "no-reserve":
                return noReserve;
            case "lowest-mileage":
                return lowestMileage;
            case "inspected":
                return inspected;
            default:
                return endingSoon;
        }
    }, [activeTab, endingSoon, inspected, lowestMileage, newlyListed, noReserve]);

    const years = useMemo(() => {
        const set = new Set(sourceList.map((item: CarAuction) => String(item.year)));
        return Array.from(set).sort((a, b) => Number(b) - Number(a));
    }, [sourceList]);

    const transmissions = useMemo(() => {
        const set = new Set(sourceList.map((item: CarAuction) => item.transmission).filter(Boolean));
        return Array.from(set);
    }, [sourceList]);

    const bodyStyles = useMemo(() => {
        const set = new Set(sourceList.map((item: CarAuction) => item.body).filter(Boolean));
        return Array.from(set);
    }, [sourceList]);

    const filteredListings = useMemo(() => {
        return sourceList.filter((listing: CarAuction) => {
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

    return <div className="pb-10">
        <AuctionBanner/>
        <div className="px-4 py-6 lg:px-8 xl:px-12">
            <div className="mx-auto flex w-full flex-col gap-6">
                <section className="">
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                            <div className="max-w-3xl">
                                <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                                    Auction Marketplace
                                </Text>
                                <Title className="mb-2! mt-3! leading-none text-black dark:text-white" level={2}>
                                    Find active vehicles worth bidding on.
                                </Title>
                                <Text className="block text-sm text-black/65 dark:text-white/70 md:text-base">
                                    Use the live sections below to focus on fast-closing inventory, fresh arrivals, no-reserve opportunities, and other high-signal auction groups.
                                </Text>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 ">
                                <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                        Live Pool
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
                                <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5 col-span-2 sm:col-span-1">
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
                            onChange={(key) => setActiveTab(key as AuctionTabKey)}
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
                                            Narrow the current auction set by year, transmission, and body style.
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
                {loading && !filteredListings.length && <LoadingScreen/>}

                {!loading && !filteredListings.length ? (
                    <div className="rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 dark:border-white/10 dark:bg-white/5">
                        <Empty
                            description="No auctions match the current selection."
                        >
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
                            {filteredListings.map((listing: CarAuction) => (
                                <AuctionItem key={listing.id} listing={listing}/>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    </div>;
}
