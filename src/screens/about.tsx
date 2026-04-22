import { Typography } from "antd";
import Navbar from "@/components/navigation/navbar.tsx";
import Footer from "@/components/navigation/footer.tsx";

const { Title, Text } = Typography;

export default function AboutPage() {
    return (
       <div>
           <Navbar/>
           <div className="bg-light-bg dark:bg-dark-bg min-h-[80vh] flex flex-col justify-center py-20 md:py-24 xl:py-28 px-4 md:px-8 xl:px-12 2xl:px-16">
               <div className="mx-auto max-w-400">

                   {/* HEADER */}
                   <div className="max-w-2xl">
                       <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                           About
                       </Text>

                       <Title level={2} className="mt-3! mb-2! leading-none text-black dark:text-white">
                           Wheels is part of the Serid platform.
                       </Title>

                       <Text className="text-sm text-black/65 dark:text-white/70">
                           Wheels is Serid’s automotive marketplace, focused on vehicle listings, live auctions, and structured buyer–seller interactions.
                       </Text>
                   </div>


                   {/* WHAT WE DO */}
                   <div className="mt-16 grid gap-6 md:grid-cols-3">

                       <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                           <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                               Listings
                           </Text>

                           <Title level={4} className="mb-2! text-black dark:text-white">
                               Structured vehicle listings
                           </Title>

                           <Text className="text-sm text-black/65 dark:text-white/70">
                               Sellers can publish vehicles with detailed specifications, media, and pricing expectations in a consistent format.
                           </Text>
                       </div>

                       <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                           <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                               Auctions
                           </Text>

                           <Title level={4} className="mb-2! text-black dark:text-white">
                               Live bidding environment
                           </Title>

                           <Text className="text-sm text-black/65 dark:text-white/70">
                               Vehicles can be exposed to real-time bidding, allowing price discovery based on active demand.
                           </Text>
                       </div>

                       <div className="rounded-2xl border border-black/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
                           <Text className="mb-2! block text-[11px]! uppercase tracking-[0.22em] text-black/40 dark:text-white/40">
                               Marketplace
                           </Text>

                           <Title level={4} className="mb-2! text-black dark:text-white">
                               Buyer–seller interaction
                           </Title>

                           <Text className="text-sm text-black/65 dark:text-white/70">
                               The platform connects individual sellers, dealers, and buyers within a single marketplace.
                           </Text>
                       </div>

                   </div>


                   {/* WHY IT EXISTS */}
                   <div className="mt-20 max-w-2xl">
                       <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                           Purpose
                       </Text>

                       <Title level={3} className="mt-3! mb-2! text-black dark:text-white">
                           Designed around how vehicles are actually sold.
                       </Title>

                       <Text className="text-sm text-black/65 dark:text-white/70">
                           Wheels reflects common patterns in the automotive market, where pricing, negotiation, and timing are shaped by demand rather than fixed listings alone.
                       </Text>
                   </div>


                   {/* SERID CONTEXT */}
                   <div className="mt-20 grid gap-6 md:grid-cols-2">

                       <div>
                           <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                               Serid
                           </Text>

                           <Title level={3} className="mt-3! mb-2! text-black dark:text-white">
                               Part of a broader platform.
                           </Title>

                           <Text className="text-sm text-black/65 dark:text-white/70">
                               Wheels is one of several services within Serid, a platform designed to support different types of listings, transactions, and marketplaces under a unified system.
                           </Text>
                       </div>

                       <div>
                           <Text className="block text-[11px]! uppercase tracking-[0.3em] text-black/45 dark:text-white/45">
                               Approach
                           </Text>

                           <Title level={3} className="mt-3! mb-2! text-black dark:text-white">
                               Structured, not fragmented.
                           </Title>

                           <Text className="text-sm text-black/65 dark:text-white/70">
                               Instead of separating listings, auctions, and discovery across multiple tools, Wheels integrates them into a single, consistent experience.
                           </Text>
                       </div>

                   </div>


                   {/* FOOTNOTE */}
                   <div className="mt-20 max-w-2xl">
                       <Text className="text-xs text-black/50 dark:text-white/50">
                           Wheels is continuously evolving as part of the Serid platform.
                       </Text>
                   </div>

               </div>
           </div>
           <Footer/>
       </div>
    );
}