import vehicle from '@/assets/vehicle.png'
import deal from '@/assets/deal.png'
import auction from '@/assets/auction.png'
import {Avatar, Button, ConfigProvider, Typography} from "antd";
import LogoComponent from "@/assets/logoComponent.tsx";
import {Link} from "react-router";
import useGlassTheme from "@/glassTheme.ts";
import Footer from "@/components/navigation/footer.tsx";
import {usePostHog} from "@posthog/react";
import {useEffect} from "react";

const {Title, Text} = Typography;

export default function SellWithUs() {
    const darkTheme = useGlassTheme('dark')
    const posthog = usePostHog()
    useEffect(() => {
        posthog.capture('sell_with_us_viewed');
    }, [posthog]);
    return (<div className="bg-black">

        {/* HERO */}
        <ConfigProvider theme={darkTheme}>
            <section className="relative h-screen w-full">
                <video
                    src={'https://pub-aa5d394257f6401294f41b23e6cfe6ea.r2.dev/common/home_video.mp4'}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                />

                <div className="absolute w-full h-full top-0 left-0 bg-black/30 flex flex-col justify-between items-center">

                    {/* NAV */}
                    <div className="flex w-full items-center justify-between px-4 py-3 md:px-6 lg:px-8 xl:px-10">
                        <Link to="/" className="flex items-center gap-3">
                            <Avatar shape="square" size="large" src={<LogoComponent className="text-white"/>}/>
                            <div>
                                <Title className="my-0! text-white!" level={4}>Wheels</Title>
                                <Text className="text-xs uppercase tracking-[0.22em] text-white!">by Serid</Text>
                            </div>
                        </Link>

                        <Link to="https://wheela-dashboard.vercel.app">
                            <Button type="primary" size="large">Go To Dashboard</Button>
                        </Link>
                    </div>

                    {/* HERO CONTENT */}
                    <div className="text-center px-4">
                        <Title level={1} className="text-white! mb-2!">
                            Sell Your Car Faster in Kenya
                        </Title>

                        <Text className="text-white! text-base md:text-lg block max-w-xl mx-auto">
                            Skip brokers. Reach real buyers, get competitive bids, and sell your car in days — not months.
                        </Text>

                        <div className="mt-6 flex gap-3 justify-center">
                            <Link to="https://wheela-dashboard.vercel.app">
                                <Button
                                type="primary"
                                size="large"
                                onClick={() => posthog.capture('sell_cta_clicked', { location: 'hero' })}
                                >
                                Start Selling
                            </Button>
                            </Link>
                            <Link to="/auctions">
                                <Button type="primary" ghost size="large">Browse Auctions</Button>
                            </Link>
                        </div>

                        <Text className="text-white! text-sm! mt-4 block">
                            No upfront fees • Pay only when you sell
                        </Text>
                    </div>

                    {/* TRAPEZIUM */}
                    <div className="w-full">
                        <div className="bg-light-bg dark:bg-dark-bg w-max pe-16 h-16 flex items-center px-4 [clip-path:polygon(0%_0%,70%_0%,100%_100%,0%_100%)]">
                            <Text className="block uppercase tracking-[0.3em] text-black! dark:text-white!">
                                Powered by
                            </Text>
                            <Title level={3} className="ml-2 my-0! text-dark! dark:text-white! font-logo">
                                SERID
                            </Title>
                        </div>
                    </div>

                </div>
            </section>
        </ConfigProvider>


        {/* HOW IT WORKS */}
        <section className="bg-light-bg dark:bg-dark-bg py-20 md:py-24 xl:py-28 2xl:py-36 px-4 md:px-8 xl:px-12 2xl:px-16 flex flex-col justify-center min-h-[60vh]">
            <div className="mx-auto max-w-400">

                <div className="max-w-2xl">

                    <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                        Process
                    </Text>

                    <Title level={2} className="mt-3! mb-2! leading-none text-black dark:text-white">
                        How listings move through the auction.
                    </Title>

                    <Text className="text-sm text-black/65 dark:text-white/70">
                        Each stage outlines how a vehicle progresses from listing to final transaction within the marketplace.
                    </Text>

                </div>

                <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center text-center">

                    {/* STEP 1 */}
                    <div className="rounded-2xl glass-card shadow! shadow-accent! border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Avatar src={vehicle} className={'dark:invert! h-20! w-20!'}/>
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Listing
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            List your vehicle
                        </Title>

                        <Text className="block text-sm text-black/65 dark:text-white/70">
                            Provide the core details of your car, including photos, specifications, and condition. A reserve price can be set to define the minimum acceptable outcome.
                        </Text>
                    </div>

                    {/* ARROW */}
                    <div className="hidden md:flex items-center justify-center text-black/30 dark:text-white/30">
                        →
                    </div>

                    {/* STEP 2 */}
                    <div className="rounded-2xl glass-card border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Avatar src={auction} className={'dark:invert! h-20! w-20!'}/>
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Auction
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Receive bids
                        </Title>

                        <Text className="block text-sm text-black/65 dark:text-white/70">
                            Once live, the listing is exposed to active buyers. Bids are placed over time, reflecting demand and shaping the final price.
                        </Text>
                    </div>

                    {/* ARROW */}
                    <div className="hidden md:flex items-center justify-center text-black/30 dark:text-white/30">
                        →
                    </div>

                    {/* STEP 3 */}
                    <div className="rounded-2xl glass-card border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Avatar src={deal} className={'dark:invert! h-20! w-20!'}/>
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Completion
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Close the Deal
                        </Title>

                        <Text className="block text-sm text-black/65 dark:text-white/70">
                            Review the highest bid at the end of the auction. If it meets your expectations, proceed with the buyer to complete the transaction.
                        </Text>
                    </div>

                </div>

            </div>
        </section>


        {/* SELLER CONTROL */}
        <section className="bg-white dark:bg-dark py-20 md:py-24 xl:py-28 2xl:py-36 px-4 md:px-8 xl:px-12 2xl:px-16 flex flex-col justify-center min-h-[60vh]">
            <div className="mx-auto max-w-400">

                {/* HEADER */}
                <div className="max-w-2xl">
                    <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                        Seller Control
                    </Text>

                    <Title level={2} className="mt-3! mb-2! leading-none text-black dark:text-white">
                        Maintain control throughout the listing process.
                    </Title>

                    <Text className="text-sm text-black/65 dark:text-white/70">
                        Listings are structured to give sellers clear control over pricing, visibility, and final decisions without being locked into outcomes.
                    </Text>
                </div>

                {/* GRID */}
                <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Pricing
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Reserve-based protection
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            A reserve price can be set to prevent the vehicle from being sold below an acceptable threshold.
                        </Text>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Flexibility
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Pre-auction adjustments
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            Listing details can be updated before the auction begins, allowing corrections and refinements.
                        </Text>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Outcome
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Seller-led decisions
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            The final sale is only completed if the outcome aligns with seller expectations at the end of the auction.
                        </Text>
                    </div>

                </div>
            </div>
        </section>


        {/* FEES (MOVED UP) */}
        <section className="bg-light-accent dark:bg-dark-bg py-20 md:py-24 xl:py-28 2xl:py-36 px-4 md:px-8 xl:px-12 2xl:px-16 flex flex-col justify-center min-h-[60vh]">
            <div className="mx-auto max-w-400">

                {/* HEADER */}
                <div className="max-w-2xl">
                    <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                        Fees
                    </Text>

                    <Title level={2} className="mt-3! mb-2! leading-none text-black dark:text-white">
                        Simple and predictable pricing.
                    </Title>

                    <Text className="text-sm text-black/65 dark:text-white/70">
                        Sellers are not charged to list vehicles. A service fee is applied to the winning buyer based on the final transaction value.
                    </Text>
                </div>

                {/* GRID */}
                <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Listing
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            No upfront cost
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            Vehicles can be listed and managed without any initial fees or subscription requirements.
                        </Text>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Buyer Fee
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            5% of final price
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            The winning bid is subject to a 5% service fee, applied to the buyer at the point of transaction.
                        </Text>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Cap
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Maximum KES 50,000
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            The service fee is capped, ensuring predictable costs regardless of higher transaction values.
                        </Text>
                    </div>

                </div>
            </div>
        </section>


        {/* MARKET CONTEXT */}
        <section className="bg-gray-50 dark:bg-black py-20 md:py-24 xl:py-28 2xl:py-36 px-4 md:px-8 xl:px-12 2xl:px-16 flex flex-col justify-center min-h-[60vh]">
            <div className="mx-auto max-w-400">
                {/* HEADER */}
                <div className="max-w-2xl">
                    <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                        Market Context
                    </Text>

                    <Title level={2} className="mt-3! mb-2! leading-none text-black dark:text-white">
                        Built around how vehicles are sold locally.
                    </Title>

                    <Text className="text-sm text-black/65 dark:text-white/70">
                        The platform reflects common pricing behaviour, buyer expectations, and transaction patterns observed in the Kenyan automotive market.
                    </Text>
                </div>

                {/* GRID */}
                <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Pricing
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Market-driven outcomes
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            Auction activity reflects real buyer demand, allowing pricing to adjust naturally based on interest and competition.
                        </Text>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Turnaround
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Shorter listing cycles
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            Active auctions compress the time between listing and sale compared to traditional classified or dealer-based channels.
                        </Text>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                        <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                            Participants
                        </Text>

                        <Title level={4} className="mb-2! leading-tight text-black dark:text-white">
                            Account-based buyers
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            Buyer activity is tied to registered accounts, creating a more structured and traceable bidding environment.
                        </Text>
                    </div>

                </div>

                {/* CTA */}
                <div className="mt-10">
                    <Link to="https://wheela-dashboard.vercel.app">
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => posthog.capture('sell_cta_clicked', { location: 'market_section' })}
                        >
                            Create a listing
                        </Button>
                    </Link>
                </div>
            </div>
        </section>


        <Footer/>
    </div>)
}