import DealerBanner from "@/components/dealer/banner.tsx";
import {Button, ConfigProvider, Empty, Select, Tabs, theme, Typography} from "antd";
import {useEffect, useMemo, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchHomeData} from "@/store/reducers/wheelsSlice.ts";
import {DealerItem} from "@/components/dealer/dealerItem.tsx";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";

const {Title, Text} = Typography;

type DealerTabKey = "new" | "popular";

const tabConfig: Array<{
    key: DealerTabKey;
    label: string;
    eyebrow: string;
    description: string;
}> = [
    {
        key: "new",
        label: "New Dealers",
        eyebrow: "Fresh profiles",
        description: "Recently added dealers entering the marketplace with new stock and visibility.",
    },
    {
        key: "popular",
        label: "Popular Dealers",
        eyebrow: "High attention",
        description: "Dealer profiles getting the strongest traffic and buyer attention right now.",
    },
];


export default function DealerScreen() {
    const dispatch = useAppDispatch();
    const {newDealers, popularDealers, loading, hasError, errorMessage} = useAppSelector((state) => state.wheels);
    const [activeTab, setActiveTab] = useState<DealerTabKey>("new");
    const [countyFilter, setCountyFilter] = useState<string | null>(null);
    const [verifiedFilter, setVerifiedFilter] = useState<string | null>(null);

    useEffect(() => {
        if (!newDealers.length && !popularDealers.length) {
            dispatch(fetchHomeData());
        }
    }, [dispatch, newDealers.length, popularDealers.length]);

    const sourceList = useMemo(() => {
        return activeTab === "new" ? newDealers : popularDealers;
    }, [activeTab, newDealers, popularDealers]);

    const counties = useMemo(() => {
        const set = new Set(
            sourceList
                .map((dealer) => dealer.locations?.[0]?.county)
                .filter(Boolean)
        );
        return Array.from(set);
    }, [sourceList]);

    const filteredDealers = useMemo(() => {
        return sourceList.filter((dealer) => {
            const matchesCounty = !countyFilter || dealer.locations?.some((location) => location.county === countyFilter);
            const matchesVerified =
                !verifiedFilter ||
                (verifiedFilter === "verified" ? Boolean(dealer.verified) : !dealer.verified);

            return matchesCounty && matchesVerified;
        });
    }, [countyFilter, sourceList, verifiedFilter]);

    const activeTabMeta = tabConfig.find((tab) => tab.key === activeTab) ?? tabConfig[0];
    const hasFilters = Boolean(countyFilter || verifiedFilter);

    const resetFilters = () => {
        setCountyFilter(null);
        setVerifiedFilter(null);
    };

    if (loading && !newDealers.length && !popularDealers.length) {
        return <LoadingScreen/>;
    }

    return (
        <div className="py-10 space-y-6 ">
            <DealerBanner/>
            <div className="px-4 py-6 lg:px-8 xl:px-12">
                <div className="mx-auto flex w-full flex-col space-y-8 gap-6">
                    <section>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                                <div className="max-w-3xl">
                                    <Text
                                        className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                                        Dealer Marketplace
                                    </Text>
                                    <Title className="mb-2! mt-3! leading-none text-black dark:text-white" level={2}>
                                        Explore trusted sellers and growing dealer networks.
                                    </Title>
                                    <Text className="block text-sm text-black/65 dark:text-white/70 md:text-base">
                                        Discover fresh dealer profiles, browse high-traffic seller pages, and narrow the
                                        set by county or verification status.
                                    </Text>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    <div
                                        className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                        <Text
                                            className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                            Dealer Pool
                                        </Text>
                                        <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                            {sourceList.length}
                                        </Title>
                                    </div>
                                    <div
                                        className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                                        <Text
                                            className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                            Matching
                                        </Text>
                                        <Title level={4} className="mb-0! leading-none text-black dark:text-white">
                                            {filteredDealers.length}
                                        </Title>
                                    </div>
                                    <div
                                        className="col-span-2 rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5 sm:col-span-1">
                                        <Text
                                            className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
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
                                onChange={(key) => setActiveTab(key as DealerTabKey)}
                                items={tabConfig.map((tab) => ({key: tab.key, label: tab.label}))}
                            />

                            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
                                <div
                                    className="rounded-2xl border border-black/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5 md:p-5">
                                    <Text
                                        className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                        {activeTabMeta.eyebrow}
                                    </Text>
                                    <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                                        {activeTabMeta.label}
                                    </Title>
                                    <Text className="block text-sm text-black/65 dark:text-white/70">
                                        {activeTabMeta.description}
                                    </Text>
                                </div>

                                <div
                                    className="rounded-2xl border border-black/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5 md:p-5">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <Text
                                                className="mb-1! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                                Refine Results
                                            </Text>
                                            <Text className="text-sm text-black/65 dark:text-white/70">
                                                Filter dealer profiles by county and verification.
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
                                            value={countyFilter}
                                            onChange={(value) => setCountyFilter(value ?? null)}
                                            placeholder="County"
                                            options={counties.map((value) => ({value, label: value}))}
                                        />
                                        <Select
                                            allowClear
                                            value={verifiedFilter}
                                            onChange={(value) => setVerifiedFilter(value ?? null)}
                                            placeholder="Verification"
                                            options={[
                                                {value: "verified", label: "Verified only"},
                                                {value: "unverified", label: "Unverified only"},
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {hasError &&
                        <Text type="danger" className="block">{errorMessage ?? "Failed to load dealers."}</Text>}

                    {!loading && !filteredDealers.length ? (
                        <div
                            className="rounded-3xl border border-dashed border-black/15 bg-white/60 p-8 dark:border-white/10 dark:bg-white/5">
                            <Empty description="No dealers match the current selection.">
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
                                        {filteredDealers.length} dealer{filteredDealers.length === 1 ? "" : "s"} in {activeTabMeta.label.toLowerCase()}.
                                    </Text>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {filteredDealers.map((dealer) => (
                                    <DealerItem key={dealer.id} dealer={dealer}/>
                                ))}
                            </div>
                        </section>
                    )}

                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#00e5ff',
                                colorText: '#F8FFFF'
                            },
                            inherit: false,
                            algorithm: theme.defaultAlgorithm,
                        }}
                    >
                        <section className="relative overflow-hidden rounded-3xl xl:aspect-20/4 bg-dark px-6 py-8 shadow-md md:px-8 md:py-10 xl:px-10">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_28%),linear-gradient(135deg,#041014_0%,#0c1f27_48%,#13222a_100%)]"/>
                            <div className="absolute -right-14 top-8 h-44 w-44 rounded-full blur-2xl"/>
                            <div className="absolute bottom-0 left-0 h-28 w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent_35%,rgba(255,255,255,0.04)_70%,transparent)]"/>

                            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end">
                                <div className="max-w-2xl">
                                    <Text className="mb-3! block text-[11px]! uppercase tracking-[0.32em] text-white/55!">
                                        Dealer Growth Program
                                    </Text>
                                    <Title level={2} className="mb-3! max-w-xl leading-[0.95] ">
                                        Put your inventory in front of more serious buyers.
                                    </Title>
                                    <Text className="block max-w-xl text-base leading-7 ">
                                        Join the marketplace to publish listings, run auctions, and build a visible dealer profile that keeps working after the first click.
                                    </Text>

                                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                        <Button size="large" type="primary">
                                            Join Us
                                        </Button>
                                        <Button size="large" color="default" variant="outlined" className={'hover:text-dark! hover:border-light-accent!'}>
                                            Learn More
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        {label: "Inventory", value: "List faster"},
                                        {label: "Auctions", value: "Sell live"},
                                        {label: "Reach", value: "More buyers"},
                                        {label: "Profile", value: "Build trust"},
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-md"
                                        >
                                            <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-white/45">
                                                {item.label}
                                            </Text>
                                            <Text className="text-sm font-medium text-white">
                                                {item.value}
                                            </Text>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}
