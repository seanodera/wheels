import {Avatar, Typography} from "antd";
import CustomCarousel from "@/components/customCarousel.tsx";
import ListingComponent from "@/components/listingComponent.tsx";
import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router";
import type {CarAuction, CarItem, Dealership} from "@/types";
import {isCarAuction, supabase} from "@/utils";
import {keysToCamelCase} from "@/utils/caseConverter.ts";
import AuctionItem from "@/components/auctionItem.tsx";

const {Title, Text, Paragraph} = Typography;

export default function SingleDealer() {
    const {id} = useParams<{ id: string }>();
    const [dealer, setDealer] = useState<Dealership | null>(null);
    const [listings, setListings] = useState<(CarItem | CarAuction)[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Missing dealer id");
            return;
        }

        const loadDealer = async () => {
            setLoading(true);
            setError(null);
            try {
                const [dealerResponse, listingsResponse] = await Promise.all([
                    supabase
                        .from("dealerships")
                        .select("*")
                        .eq("id", id)
                        .maybeSingle(),
                    supabase
                        .from("vehicles")
                        .select("*,auction:auctions(*), listing:listings(*)")
                        .eq("published", true)
                        .eq("seller_id", id)
                        .order("created_at", {ascending: false})
                        .limit(16)
                ]);

                if (dealerResponse.error) {
                    setError(dealerResponse.error.message);
                    return;
                }

                if (!dealerResponse.data) {
                    setError("Dealer not found");
                    return;
                }

                if (listingsResponse.error) {
                    setError(listingsResponse.error.message);
                    return;
                }

                setDealer(keysToCamelCase<Dealership>(dealerResponse.data));

                const data = (listingsResponse.data ?? [])
                    .map((listing) => {
                        if (!listing) return undefined;

                        if (listing.type === 'auction' && listing.auction) {
                            return keysToCamelCase<CarAuction>({
                                ...listing,
                                ...listing.auction,
                            });
                        }

                        if (listing.type === 'listing' && listing.listing) {
                            return keysToCamelCase<CarItem>({
                                ...listing,
                                ...listing.listing,
                            });
                        }

                        return undefined;
                    })
                    .filter((item): item is CarAuction | CarItem => Boolean(item));

                setListings(data);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                    return;
                }
                setError("Failed to load dealer profile");
            } finally {
                setLoading(false);
            }
        };

        void loadDealer();
    }, [id]);

    const imageSet = useMemo(() => dealer?.images ?? [], [dealer?.images]);

    if (loading) {
        return <div className={"px-4 lg:px-16 py-10"}>Loading dealer profile...</div>;
    }

    if (error) {
        return <div className={"px-4 lg:px-16 py-10 text-red-500"}>{error}</div>;
    }

    if (!dealer) {
        return <div className={"px-4 lg:px-16 py-10"}>No dealer found.</div>;
    }

    return (
        <div className={'px-4 lg:px-16 space-y-8'}>
            <div>
                <div className={'flex justify-between mb-4 mt-8'}>
                    <div>
                        <Title level={1} className={'leading-none !my-0'}>{dealer.name}</Title>
                        <Text className={'leading-none !my-0'}>
                            {dealer.locations?.[0]?.subCounty}, {dealer.locations?.[0]?.county}
                        </Text>
                    </div>
                    <Avatar className={' !h-16 !w-16'} size={'large'} src={dealer.profile} shape={'circle'}/>
                </div>
                {imageSet.length > 0 && (
                    <CustomCarousel items={1}>
                        {imageSet.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                className={'w-full mb-4 object-cover object-center rounded-xl aspect-[20/7]'}
                                alt={image}
                            />
                        ))}
                    </CustomCarousel>
                )}
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-4'}>
                <div className={'col-span-3'}>
                    <Title>Description</Title>
                    <Paragraph>{dealer.description || "No description provided yet."}</Paragraph>
                </div>
                <div className={'space-y-4 flex flex-col justify-center items-end'}>
                    <div>
                        <Title className={'!leading-none !my-0'}>{dealer.listingCount}</Title>
                        <Text className={'!leading-none !mt-0 !mb-4'} type={'secondary'}>Listings</Text>

                        <Title className={'!leading-none !my-0'}>{dealer.soldCount}</Title>
                        <Text className={'!leading-none !mt-0 !mb-4'} type={'secondary'}>Sold Vehicles</Text>

                        <Title className={'leading-none! !my-0'}>{dealer.views}</Title>
                        <Text className={'leading-none! !mt-0 !mb-4'} type={'secondary'}>Views</Text>
                    </div>
                </div>
            </div>
            <div className={'py-8 space-y-8'}>
                <Title level={2} className={'leading-none !my-0'}>Listings</Title>
                {listings.length === 0 ? (
                    <Text type={"secondary"}>No listings available for this dealer yet.</Text>
                ) : (
                    <div className={'grid grid-cols-2 md:grid-cols-4 gap-8 mt-4'}>
                        {listings.map((listing, index) => isCarAuction(listing) ?
                            <AuctionItem listing={listing} key={index}/> :
                            <ListingComponent listing={listing} key={`${listing.id}-${index}`}/>)}
                    </div>
                )}
            </div>
        </div>
    );
}
