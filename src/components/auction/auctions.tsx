import { useState } from "react";
import { CarAuction } from "@/types.ts";
import AuctionItem from "@/components/auctionItem.tsx";
import { generateCarAuction } from "@/data/generator.ts";
import { Dropdown, Menu, Tabs, Typography, Button, Select, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Auctions() {
    const [listings] = useState<CarAuction[]>(Array.from({ length: 20 }, (_, id) => generateCarAuction(id)));

    // Filter states
    const [yearRange, setYearRange] = useState<[string | null, string | null]>([null, null]);
    const [transmissionFilter, setTransmissionFilter] = useState<string | null>(null);
    const [bodyStyleFilter, setBodyStyleFilter] = useState<string | null>(null);

    // Sample filter options
    const years = Array.from({ length: 15 }, (_, i) => (2024 - i).toString());
    const transmissions = ["Automatic", "Manual"];
    const bodyStyles = ["Sedan", "SUV", "Truck", "Coupe", "Hatchback"];

    // Filtering logic
    const filteredListings = listings.filter((listing) => {
        const [startYear, endYear] = yearRange;
        return (
            (!startYear || !endYear || (listing.year >= parseInt(startYear) && listing.year <= parseInt(endYear))) &&
            (!transmissionFilter || listing.transmission === transmissionFilter) &&
            (!bodyStyleFilter || listing.body === bodyStyleFilter)
        );
    });

    return (
        <div className="py-4 px-4 lg:px-16">
            {/* Header & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Title & Filters */}
                {/*<Title className="md:hidden leading-none !my-0" level={2}>Auctions</Title>*/}
                <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 w-full">
                    <Title className="leading-none !my-0" level={2}>Auctions</Title>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        {/* Year Filter (Range) */}
                        <Dropdown
                            trigger={["click"]}
                            overlay={
                                <Menu>
                                    <Menu.Item>
                                        <Space>
                                            <Select
                                                value={yearRange[0]}
                                                onChange={(value) => setYearRange([value, yearRange[1]])}
                                                placeholder="From"
                                                className="w-24"
                                                options={years.map((year) => ({ value: year, label: year }))}
                                            />
                                            <span>to</span>
                                            <Select
                                                value={yearRange[1]}
                                                onChange={(value) => setYearRange([yearRange[0], value])}
                                                placeholder="To"
                                                className="w-24"
                                                options={years.map((year) => ({ value: year, label: year }))}
                                            />
                                        </Space>
                                    </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button className="flex items-center gap-2">
                                {yearRange[0] && yearRange[1] ? `${yearRange[0]} - ${yearRange[1]}` : "Years"}
                                <DownOutlined />
                            </Button>
                        </Dropdown>

                        {/* Transmission Filter */}
                        <Dropdown
                            trigger={["click"]}
                            overlay={
                                <Menu>
                                    {transmissions.map((trans) => (
                                        <Menu.Item key={trans} onClick={() => setTransmissionFilter(trans)}>
                                            {trans}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            }
                        >
                            <Button className="flex items-center gap-2">
                                {transmissionFilter || "Transmission"} <DownOutlined />
                            </Button>
                        </Dropdown>

                        {/* Body Style Filter */}
                        <Dropdown
                            trigger={["click"]}
                            overlay={
                                <Menu>
                                    {bodyStyles.map((body) => (
                                        <Menu.Item key={body} onClick={() => setBodyStyleFilter(body)}>
                                            {body}
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            }
                        >
                            <Button className="flex items-center gap-2">
                                {bodyStyleFilter || "Body Style"} <DownOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                </div>

                {/* Auction Tabs */}
                <Tabs
                    defaultActiveKey="ending-soon"
                    className="w-full md:w-auto"
                    items={[
                        { key: "ending-soon", label: "Ending Soon" },
                        { key: "newly-listed", label: "Newly Listed" },
                        { key: "no-reserve", label: "No Reserve" },
                        { key: "lowest-mileage", label: "Lowest Mileage" },
                        { key: "inspected", label: "Inspected" },
                    ]}
                />
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-4">
                {filteredListings.map((listing) => (
                    <AuctionItem key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
}
