import {useEffect, useMemo, useState} from "react";
import AuctionItem from "@/components/auctionItem.tsx";
import {Select, Tabs, Typography} from "antd";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {fetchAuctionsAsync} from "@/store/reducers/auctionSlice.ts";

const {Title} = Typography;

type AuctionTabKey = "ending-soon" | "newly-listed" | "no-reserve" | "lowest-mileage" | "inspected";

export default function Auctions() {
    const dispatch = useAppDispatch();
    const {auctions, endingSoon, newlyListed, noReserve, lowestMileage, inspected} = useAppSelector((state) => state.auction);
    const [activeTab, setActiveTab] = useState<AuctionTabKey>("ending-soon");

    const [yearRange, setYearRange] = useState<[string | null, string | null]>([null, null]);
    const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null);
    const [bodyStyleFilter, setBodyStyleFilter] = useState<string | null>(null);

    useEffect(() => {
        if (!auctions.length) {
            dispatch(fetchAuctionsAsync());
        }
    }, [auctions.length, dispatch]);

    const sourceList = useMemo(() => {
        if (activeTab === "ending-soon") {
            return endingSoon;
        }
        if (activeTab === "newly-listed") {
            return newlyListed;
        }
        if (activeTab === "no-reserve") {
            return noReserve;
        }
        if (activeTab === "lowest-mileage") {
            return lowestMileage;
        }
        return inspected;
    }, [activeTab, endingSoon, inspected, lowestMileage, newlyListed, noReserve]);

    const years = useMemo(() => {
        const set = new Set(sourceList.map((listing) => String(listing.year)));
        return Array.from(set).sort((a, b) => Number(b) - Number(a));
    }, [sourceList]);
    const transmissions = useMemo(() => {
        const set = new Set(sourceList.map((listing) => listing.transmission).filter(Boolean));
        return Array.from(set);
    }, [sourceList]);
    const bodyStyles = useMemo(() => {
        const set = new Set(sourceList.map((listing) => listing.body).filter(Boolean));
        return Array.from(set);
    }, [sourceList]);

    const filteredListings = useMemo(
        () =>
            sourceList.filter((listing) => {
                const [startYear, endYear] = yearRange;
                const matchesYear = !startYear || !endYear || (listing.year >= Number(startYear) && listing.year <= Number(endYear));
                const matchesTransmission = !transmissionFilter || listing.transmission === transmissionFilter;
                const matchesBody = !bodyStyleFilter || listing.body === bodyStyleFilter;
                return matchesYear && matchesTransmission && matchesBody;
            }),
        [bodyStyleFilter, sourceList, transmissionFilter, yearRange]
    );

    return (
        <div className="py-4 px-4 lg:px-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 w-full">
                    <Title className="leading-none !my-0" level={2}>Auctions</Title>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full md:w-auto">
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
                    className="w-full md:w-auto"
                    items={[
                        {key: "ending-soon", label: "Ending Soon"},
                        {key: "newly-listed", label: "Newly Listed"},
                        {key: "no-reserve", label: "No Reserve"},
                        {key: "lowest-mileage", label: "Lowest Mileage"},
                        {key: "inspected", label: "Inspected"}
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4">
                {filteredListings.map((listing) => (
                    <AuctionItem key={listing.id} listing={listing}/>
                ))}
            </div>
        </div>
    );
}
