import {useEffect, useMemo, useState} from "react";
import {Select, Tabs, Typography} from "antd";
import AuctionBanner from "@/components/auction/banner.tsx";
import AuctionItem from "@/components/auctionItem.tsx";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchAuctionsAsync} from "@/store/reducers/auctionSlice.ts";
import type {CarAuction} from "@/types";

const {Title, Text} = Typography;

type AuctionTabKey = "ending-soon" | "newly-listed" | "no-reserve" | "lowest-mileage" | "inspected";

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

    return <div>
        <AuctionBanner/>
        <div className="py-4 px-4 lg:px-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4">
                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 w-full">
                    <Title className="leading-none !my-0 text-nowrap" level={2}>Auctions</Title>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
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

                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as AuctionTabKey)}
                    className="w-full lg:w-auto"
                    items={[
                        {key: "ending-soon", label: "Ending Soon"},
                        {key: "newly-listed", label: "Newly Listed"},
                        {key: "no-reserve", label: "No Reserve"},
                        {key: "lowest-mileage", label: "Lowest Mileage"},
                        {key: "inspected", label: "Inspected"}
                    ]}
                />
            </div>

            {error && <Text type="danger" className="block pb-2">{error}</Text>}
            {loading && !filteredListings.length && <Text className="block pb-2">Loading auctions...</Text>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4">
                {filteredListings.map((listing: CarAuction) => (
                    <AuctionItem key={listing.id} listing={listing}/>
                ))}
            </div>
        </div>
    </div>;
}
