import {Typography} from "antd";
import Navbar from "@/components/navigation/navbar.tsx";
import Footer from "@/components/navigation/footer.tsx";

const {Title, Text} = Typography;

export default function PricingPage() {
    return (
        <div>
            <Navbar/>
            <div className="bg-light-bg dark:bg-dark-bg min-h-[80vh] flex flex-col justify-center py-20 md:py-24 xl:py-28 px-4 md:px-8 xl:px-12 2xl:px-16">
                <div className="mx-auto max-w-400">

                    {/* HEADER */}
                    <div className="max-w-2xl">
                        <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                            Pricing
                        </Text>

                        <Title level={2} className="mt-3! mb-2! leading-none text-black dark:text-white">
                            Clear and predictable fees.
                        </Title>

                        <Text className="text-sm text-black/65 dark:text-white/70">
                            The platform applies a simple fee structure based on completed transactions. Sellers list at no cost, while a capped service fee applies to buyers.
                        </Text>
                    </div>

                    {/* MAIN GRID */}
                    <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-2">

                        {/* SELLERS */}
                        <div className="rounded-2xl border border-black/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
                            <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                Sellers
                            </Text>

                            <Title level={3} className="mb-2! leading-tight text-black dark:text-white">
                                No listing fees
                            </Title>

                            <Text className="text-sm text-black/65 dark:text-white/70">
                                Vehicles can be listed, updated, and managed without any upfront cost. Sellers retain full control and only proceed if the final bid meets their expectations.
                            </Text>

                            <div className="mt-4 text-xs text-black/50 dark:text-white/50">
                                No subscriptions · No hidden charges · No obligation to accept bids
                            </div>
                        </div>

                        {/* BUYERS */}
                        <div className="rounded-2xl border border-black/10 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5">
                            <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                Buyers
                            </Text>

                            <Title level={3} className="mb-2! leading-tight text-black dark:text-white">
                                5% service fee
                            </Title>

                            <Text className="text-sm text-black/65 dark:text-white/70">
                                A service fee of 5% is applied to the final winning bid. This fee is capped at KES 50,000 per transaction.
                            </Text>

                            <div className="mt-4 text-xs text-black/50 dark:text-white/50">
                                Applied only to winning bids · Shown before confirmation
                            </div>
                        </div>

                    </div>

                    {/* EXAMPLE SECTION */}
                    <div className="mt-16 max-w-2xl">
                        <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                            Example
                        </Text>

                        <Title level={4} className="mt-3! mb-2! text-black dark:text-white">
                            How the buyer fee is calculated.
                        </Title>

                        <div className="mt-4 space-y-3 text-sm text-black/65 dark:text-white/70">
                            <div>Winning bid: KES 500,000 → Fee: KES 25,000</div>
                            <div>Winning bid: KES 1,000,000 → Fee: KES 50,000 (cap reached)</div>
                            <div>Winning bid: KES 2,000,000 → Fee: KES 50,000 (cap applies)</div>
                        </div>
                    </div>

                    {/* WHEN FEES APPLY */}
                    <div className="mt-16 grid gap-6 md:grid-cols-3">

                        <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                            <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                Timing
                            </Text>

                            <Title level={5} className="mb-2! text-black dark:text-white">
                                Applied after auction ends
                            </Title>

                            <Text className="text-sm text-black/65 dark:text-white/70">
                                The buyer fee is only calculated once a winning bid is established.
                            </Text>
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                            <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                Visibility
                            </Text>

                            <Title level={5} className="mb-2! text-black dark:text-white">
                                Always shown upfront
                            </Title>

                            <Text className="text-sm text-black/65 dark:text-white/70">
                                Buyers are shown the total cost before completing the transaction.
                            </Text>
                        </div>

                        <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                            <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                                Scope
                            </Text>

                            <Title level={5} className="mb-2! text-black dark:text-white">
                                Per transaction
                            </Title>

                            <Text className="text-sm text-black/65 dark:text-white/70">
                                The fee applies individually to each completed auction.
                            </Text>
                        </div>

                    </div>

                    {/* FOOTNOTE */}
                    <div className="mt-16 max-w-2xl">
                        <Text className="text-xs text-black/50 dark:text-white/50">
                            Fees are subject to change and will always be communicated clearly before any transaction is completed.
                        </Text>
                    </div>

                </div>
            </div>
            <Footer/>
        </div>
    );
}