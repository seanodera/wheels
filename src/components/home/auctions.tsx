import { useState } from "react";
import { CarAuction } from "@/types.ts";
import AuctionItem from "@/components/auctionItem.tsx";
import { generateCarAuction } from "@/data/generator.ts";
import {Dropdown, Menu, Tabs, Typography, Button, Select, Space} from "antd";
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
            <div className="flex justify-between">
                {/* Title & Filters */}
                <div className="flex gap-2 items-center">
                    <Title className={'leading-none !my-0'} level={2}>Auctions</Title>

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
                                            style={{ width: 100 }}
                                            options={years.map((year) => ({ value: year, label: year }))}
                                        />
                                        <span>to</span>
                                        <Select
                                            value={yearRange[1]}
                                            onChange={(value) => setYearRange([yearRange[0], value])}
                                            placeholder="To"
                                            style={{ width: 100 }}
                                            options={years.map((year) => ({ value: year, label: year }))}
                                        />
                                    </Space>
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button >
                            {yearRange[0] && yearRange[1]
                                ? `${yearRange[0]} - ${yearRange[1]}`
                                : "Years"}{" "}
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
                        <Button >
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
                        <Button>
                            {bodyStyleFilter || "Body Style"} <DownOutlined />
                        </Button>
                    </Dropdown>

                </div>

                {/* Auction Tabs */}
                <div>
                    <Tabs
                        defaultActiveKey="ending-soon"
                        items={[
                            { key: "ending-soon", label: "Ending Soon" },
                            { key: "newly-listed", label: "Newly Listed" },
                            { key: "no-reserve", label: "No Reserve" },
                            { key: "lowest-mileage", label: "Lowest Mileage" },
                            { key: "inspected", label: "Inspected" },
                        ]}
                    />
                </div>
            </div>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-4">
                {filteredListings.map((listing) => (
                    <AuctionItem key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
}
