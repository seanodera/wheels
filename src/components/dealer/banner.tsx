import {Avatar, Carousel, Typography} from "antd";
import {useAppSelector} from "@/store/hooks.ts";
import {HighlightBackground} from "@/components/common.tsx";
import {EnvironmentOutlined, StarFilled} from "@ant-design/icons";
import {Link} from "react-router";
import {Dealership} from "@/types";

const {Title, Text} = Typography;

function formatLocation() {
    return (location?: {subCounty?: string; county?: string; country?: string}) =>
        [location?.subCounty, location?.county, location?.country].filter(Boolean).join(", ");
}

export function FeaturedDealer({featuredDealer}:{featuredDealer: Dealership}) {
    const getLocation = formatLocation();
    const heroImage = featuredDealer.banner || featuredDealer.images[0] || featuredDealer.profile || "/placeholder.jpg";
    const locationText = getLocation(featuredDealer.locations?.[0]);

    return (
        <div className="">
            <div className="mb-4 lg:hidden grid grid-cols-2 grid-rows-3 gap-2">
                <Link to={`/dealers/${featuredDealer.id}`} className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
                    <img
                        src={heroImage}
                        className="aspect-2.5/1 w-full object-cover"
                        alt={featuredDealer.name}
                    />

                    <div className="absolute inset-0 flex h-full w-full flex-col justify-between bg-linear-to-t from-black/80 via-black/20 to-black/10 p-3">
                        <div className="flex items-start justify-between gap-2">
                            <HighlightBackground>Featured Dealer</HighlightBackground>
                            <div className="max-w-[64%] rounded-xl bg-black/30 px-2.5 py-2 backdrop-blur-md">
                                <div className={'flex items-center gap-3'}>
                                    <Avatar src={featuredDealer.profile || featuredDealer.banner || featuredDealer.images[0]} size={24} shape="circle"/>
                                    <Title level={5} className="my-0! text-base! leading-tight text-white!">
                                        {featuredDealer.name}
                                    </Title>
                                </div>

                                <Text className="my-0! block text-[11px] leading-snug text-white/80!">
                                    {locationText || "Trusted marketplace seller"}
                                </Text>
                            </div>
                        </div>

                        <div className="flex items-end justify-between gap-2">
                            <div className="max-w-max rounded-xl bg-black/45 px-2.5 py-1.5 backdrop-blur-md">
                                <Text className="my-0 text-xs font-medium leading-none text-white!">
                                    {featuredDealer.listingCount} listings
                                </Text>
                            </div>
                            <div className="max-w-max rounded-xl bg-black/45 px-2.5 py-1.5 backdrop-blur-md">
                                <Text className="my-0 text-xs font-medium leading-none text-white!">
                                    {featuredDealer.auctionCount} auctions
                                </Text>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="hidden overflow-hidden rounded-3xl border border-black/10 bg-light-accent shadow-md dark:border-white/10 dark:bg-dark glass-card lg:block">
                <div className="grid grid-cols-[1.15fr_0.85fr]">
                    <Link to={`/dealers/${featuredDealer.id}`} className="relative block">
                        <img
                            src={heroImage}
                            className="h-full w-full object-cover aspect-video"
                            alt={featuredDealer.name}
                        />

                        <div className="absolute inset-0 flex h-full w-full flex-col justify-between bg-linear-to-t from-black/80 via-black/20 to-black/10 p-6">
                            <div className="flex items-start justify-between gap-3">
                                <HighlightBackground>Featured Dealer</HighlightBackground>
                                <div className="max-w-[78%] rounded-2xl bg-black/30 p-4 backdrop-blur-md">
                                    <Title level={4} className="my-0! leading-tight text-white!">
                                        {featuredDealer.name}
                                    </Title>
                                    <Text className="my-0! block leading-snug text-white/80!">
                                        {locationText || "Dealer profile active on the marketplace"}
                                    </Text>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-max rounded-2xl bg-black/45 px-3 py-2 backdrop-blur-md">
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.22em] text-white/65!">
                                        Inventory Reach
                                    </Text>
                                    <Title level={4} className="my-0! leading-none text-white!">
                                        {featuredDealer.listingCount} listings
                                    </Title>
                                </div>

                                <div className="flex max-w-max items-center gap-2 rounded-2xl bg-black/45 px-3 py-2 backdrop-blur-md">
                                    <Text className="my-0 leading-none text-white/75!">
                                        <StarFilled/>
                                    </Text>
                                    <div>
                                        <Text className="block text-[11px]! uppercase tracking-[0.18em] text-white/65!">
                                            Dealer Rating
                                        </Text>
                                        <Text className="my-0 font-medium leading-none text-white!">
                                            {featuredDealer.rating ? featuredDealer.rating.toFixed(1) : "Unrated"}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="flex flex-col justify-between gap-5 p-7">
                        <div className="space-y-3">
                            <Text className="block text-[11px]! uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                                Showcase Dealer
                            </Text>
                            <div className={'flex items-center gap-3'}>
                                <Avatar src={featuredDealer.profile || featuredDealer.banner || featuredDealer.images[0]} size={64} shape="circle"/>
                                <Title level={2} className="mb-0! leading-[1.02] text-black dark:text-white">
                                    {featuredDealer.name}
                                </Title>
                            </div>

                            <Text className="block max-w-md text-sm text-black/65 dark:text-white/70">
                                {featuredDealer.description || "A dealer profile with active inventory, live marketplace visibility, and room to explore current stock."}
                            </Text>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                {label: "Listings", value: featuredDealer.listingCount},
                                {label: "Auctions", value: featuredDealer.auctionCount},
                                {label: "Sold", value: featuredDealer.soldCount},
                                {label: "Views", value: featuredDealer.views},
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-black/10 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                                >
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                        {item.label}
                                    </Text>
                                    <Text className="text-sm font-medium text-black dark:text-white">
                                        {item.value}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                            <div className="min-w-0">
                                <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                    Primary Location
                                </Text>
                                <Text className="truncate text-sm text-black dark:text-white">
                                    {locationText || "Location not provided"}
                                </Text>
                            </div>
                            <EnvironmentOutlined className="text-black/45 dark:text-white/45"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DealerBanner() {
    const {popularDealers} = useAppSelector((state) => state.wheels);
    const dealers = popularDealers.slice(0, 6);
    return <div className={'px-4 md:px-16 space-y-10'}>
        {/*<Title className={'p-4 !leading-none !my-0'} level={1}>Dealers</Title>*/}
        <Title level={3}>Featured Dealers</Title>


        <Carousel arrows dots autoplay={{
            dotDuration: true
        }} autoplaySpeed={5000}>
            {dealers.map((dealer, index) => <FeaturedDealer key={index} featuredDealer={dealer}/>)}
        </Carousel>

    </div>
}