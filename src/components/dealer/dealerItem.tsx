import type {Dealership} from "@/types";
import {Tag, Typography} from "antd";
import {Link} from "react-router";
import {EnvironmentOutlined} from "@ant-design/icons";

const {Title, Text} = Typography;


function dealerLocation(dealer: Dealership) {
    const firstLocation = dealer.locations?.[0];
    if (!firstLocation) return null;
    return [firstLocation.county, firstLocation.country].filter(Boolean).join(", ");
}

export function DealerItem({dealer, className = '', square}: {
    dealer: Dealership,
    className?: string,
    square?: boolean
}) {
    const primaryLocation = dealer.locations?.[0];
    const place = [primaryLocation?.subCounty, primaryLocation?.county].filter(Boolean).join(", ");
    const coverImage = dealer.images[0] || dealer.banner || dealer.profile || "/placeholder.jpg";
    const typeLabel = dealer.type === "company" ? "Dealer" : "Individual";

    return (
        <Link
            to={`/dealers/${dealer.id}`}
            className={`group block w-full space-y-3 ${className}`}
        >
            <div
                className="flex items-start justify-between rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-sm ">
                <div className="min-w-0">
                    <Title className="leading-none! my-0! truncate text-black dark:text-white" level={5}>
                        {dealer.name}
                    </Title>
                    <Text className="leading-none! mt-1! mb-0! block text-black/60 dark:text-white/65">
                        {place || "Marketplace dealer"}
                    </Text>
                </div>

                <div className="text-center">
                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.18em] ">
                        Listings
                    </Text>
                    <Title className="mt-0! leading-none! text-black dark:text-white" level={5}>
                        {dealer.listingCount}
                    </Title>
                </div>
            </div>

            <div
                className="overflow-hidden relative rounded-2xl border border-black/10 bg-white/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-sm dark:border-white/10 dark:bg-white/5">
                <img
                    src={coverImage}
                    className={`${square ? "aspect-square" : "aspect-16/10"} w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]`}
                    alt={dealer.name}
                />
                <div className="absolute top-2 px-2 flex justify-between items-center gap-2">
                    <Tag variant={'filled'}
                         className="m-0 rounded-full bg-black/6 px-3 py-1 text-[10px]! uppercase tracking-[0.18em] text-black dark:bg-white/10 dark:text-white">
                        {typeLabel}
                    </Tag>
                    {dealer.verified && (
                        <Tag color="green" className="m-0 rounded-full px-3 py-1">
                            Verified
                        </Tag>
                    )}
                </div>
            </div>

            <div
                className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                    Coverage
                </Text>
                <Text className="text-sm text-black dark:text-white">
                    <EnvironmentOutlined/> {dealerLocation(dealer) ?? "Location not specified"}
                </Text>
            </div>
        </Link>
    );
}
