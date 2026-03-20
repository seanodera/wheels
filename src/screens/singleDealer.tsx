import {Avatar, Typography} from "antd";
import CustomCarousel from "@/components/customCarousel.tsx";
import ListingComponent from "@/components/listingComponent.tsx";
import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router";
import type {CarItem, Dealer} from "@/types";
import {supabase} from "@/utils";
import {keysToCamelCase} from "@/utils/caseConverter.ts";

const {Title, Text, Paragraph} = Typography;

export default function SingleDealer() {
    const {id} = useParams<{ id: string }>();
    const [dealer, setDealer] = useState<Dealer | null>(null);
    const [listings, setListings] = useState<CarItem[]>([]);
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
                        .from("dealers")
                        .select("*")
                        .eq("id", id)
                        .maybeSingle(),
                    supabase
                        .from("vehicles")
                        .select("*")
                        .eq("type", "listing")
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

                setDealer(keysToCamelCase<Dealer>(dealerResponse.data));
                setListings((listingsResponse.data ?? []).map((listing) => keysToCamelCase<CarItem>(listing)));
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
                            {dealer.location?.district}, {dealer.location?.city}
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

                        <Title className={'!leading-none !my-0'}>{dealer.views}</Title>
                        <Text className={'!leading-none !mt-0 !mb-4'} type={'secondary'}>Views</Text>
                    </div>
                </div>
            </div>
            <div className={'py-8 space-y-8'}>
                <Title level={2} className={'leading-none !my-0'}>Listings</Title>
                {listings.length === 0 ? (
                    <Text type={"secondary"}>No listings available for this dealer yet.</Text>
                ) : (
                    <div className={'grid grid-cols-2 md:grid-cols-4 gap-8 mt-4'}>
                        {listings.map((listing, index) => <ListingComponent listing={listing} key={`${listing.id}-${index}`}/>)}
                    </div>
                )}
            </div>
        </div>
    );
}
