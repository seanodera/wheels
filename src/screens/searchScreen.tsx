import {useEffect} from "react";
import {Empty, Input, Select, Tabs, Typography} from "antd";
import AuctionItem from "@/components/auction/auctionItem.tsx";
import ListingComponent from "@/components/listings/listingComponent.tsx";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";
import {fetchAuctionsAsync} from "@/store/reducers/auctionSlice.ts";
import {fetchListingAsync} from "@/store/reducers/listingSlice.ts";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {isCarAuction} from "@/utils";
import {
    setActiveTab,
    setBodyFilter,
    setBrandFilter,
    setFuelFilter,
    setQuery,
    setSortBy,
    setTransmissionFilter,
    syncSearchInventory
} from "@/store/reducers/searchSlice.ts";
import {usePostHog} from "@posthog/react";

const {Search} = Input;
const {Title, Text} = Typography;

export default function SearchScreen() {
    const dispatch = useAppDispatch();
    const posthog = usePostHog();
    const {auctions, loading: auctionsLoading, error: auctionsError, auctionsFetched} = useAppSelector((state) => state.auction);
    const {listings, loading: listingsLoading, error: listingsError, fetchedPages} = useAppSelector((state) => state.listing);
    const {
        activeTab,
        query,
        brandFilter,
        bodyFilter,
        fuelFilter,
        transmissionFilter,
        sortBy,
        brands,
        bodyStyles,
        fuelTypes,
        transmissions,
        filteredResults,
    } = useAppSelector((state) => state.search);

    useEffect(() => {
        if (!auctionsFetched && !auctions.length) {
            dispatch(fetchAuctionsAsync());
        }

        if (!fetchedPages.length && !listings.length) {
            dispatch(fetchListingAsync({page: 1, pageSize: 24}));
        }
    }, [auctions.length, auctionsFetched, dispatch, fetchedPages.length, listings.length]);

    useEffect(() => {
        dispatch(syncSearchInventory({auctions, listings}));
    }, [auctions, dispatch, listings]);

    const loading = auctionsLoading || listingsLoading;
    const error = auctionsError || listingsError;

    return (
        <div className="px-4 py-4 lg:px-16">
            <div className="mx-auto flex w-full flex-col gap-6">
                <section>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <Text className="text-[11px]! uppercase tracking-[0.38em] text-black/45">
                                    Search Inventory
                                </Text>
                                <Title level={2} className="mb-0! mt-2! text-black">
                                    Find auctions and listings fast
                                </Title>
                                <Text className="mt-3 block text-black/65">
                                    Search across shared vehicle attributes from the automotive catalog.
                                </Text>
                            </div>
                            <div className="inline-flex w-fit items-center rounded-full bg-light-accent glass-card dark:bg-dark px-4 py-2">
                                <Text className="text-xs! uppercase tracking-[0.28em] text-black/55">
                                    {filteredResults.length} results
                                </Text>
                            </div>
                        </div>

                        <Search
                            allowClear
                            value={query}
                            onChange={(event) => dispatch(setQuery(event.target.value))}
                            onSearch={(value) => {
                                if (value.trim()) {
                                    posthog?.capture('search_performed', {
                                        query: value,
                                        results_count: filteredResults.length,
                                        active_tab: activeTab,
                                    });
                                }
                            }}
                            placeholder="Search by brand, model, body, engine or tags"
                            size="large"
                            className="search-screen-input"
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                            <Select
                                allowClear
                                size="large"
                                value={brandFilter}
                                onChange={(value) => dispatch(setBrandFilter(value ?? null))}
                                placeholder="Brand"
                                options={brands.map((value) => ({value, label: value}))}
                            />
                            <Select
                                allowClear
                                size="large"
                                value={bodyFilter}
                                onChange={(value) => dispatch(setBodyFilter(value ?? null))}
                                placeholder="Body Style"
                                options={bodyStyles.map((value) => ({value, label: value}))}
                            />
                            <Select
                                allowClear
                                size="large"
                                value={fuelFilter}
                                onChange={(value) => dispatch(setFuelFilter(value ?? null))}
                                placeholder="Fuel Type"
                                options={fuelTypes.map((value) => ({value, label: value}))}
                            />
                            <Select
                                allowClear
                                size="large"
                                value={transmissionFilter}
                                onChange={(value) => dispatch(setTransmissionFilter(value ?? null))}
                                placeholder="Transmission"
                                options={transmissions.map((value) => ({value, label: value}))}
                            />
                            <Select
                                size="large"
                                value={sortBy}
                                onChange={(value) => dispatch(setSortBy(value))}
                                placeholder="Sort"
                                options={[
                                    {value: "newest", label: "Newest"},
                                    {value: "ending-soon", label: "Ending Soon"},
                                    {value: "year-desc", label: "Year: Newest"},
                                    {value: "year-asc", label: "Year: Oldest"},
                                    {value: "price-desc", label: "Price: High to Low"},
                                    {value: "price-asc", label: "Price: Low to High"}
                                ]}
                            />
                        </div>

                        <Tabs
                            activeKey={activeTab}
                            onChange={(key) => dispatch(setActiveTab(key as "all" | "auctions" | "listings"))}
                            items={[
                                {key: "all", label: `All (${auctions.length + listings.length})`},
                                {key: "auctions", label: `Auctions (${auctions.length})`},
                                {key: "listings", label: `Listings (${listings.length})`}
                            ]}
                        />
                    </div>
                </section>

                {error && <Text type="danger">{error}</Text>}
                {loading && !filteredResults.length && <LoadingScreen/>}

                {!loading && !filteredResults.length ? (
                    <div className="rounded-2xl p-10">
                        <Empty description="No vehicles match your filters"/>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredResults.map((item) =>
                            isCarAuction(item) ? (
                                <AuctionItem key={`auction-${item.id}`} listing={item}/>
                            ) : (
                                <ListingComponent key={`listing-${item.id}`} listing={item}/>
                            )
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
