import {Avatar, Typography} from "antd";
import {generateCarListing, generateDealers} from "@/data/generator.ts";
import CustomCarousel from "@/components/customCarousel.tsx";
import {useState} from "react";
import ListingComponent from "@/components/listingComponent.tsx";


const {Title,Text,Paragraph} = Typography;
export default function SingleDealer() {
    const [dealer] = useState(generateDealers(0))
    const [listings] = useState(Array.from({length: dealer.listing_count}, (_,index) => generateCarListing(index,dealer)))
    return (<div className={'px-16 space-y-8'}>
        <div>
            <div className={'flex justify-between mb-4 mt-8'}>
                <div>
                    <Title level={1} className={'leading-none !my-0'}>{dealer.name}</Title>
                    <Text className={'leading-none !my-0'}>{dealer.location.district}, {dealer.location.city}</Text>
                </div>
                <Avatar className={' !h-16 !w-16'} size={'large'} src={dealer.profile} shape={'circle'}/>
            </div>
            <CustomCarousel items={1}>
                {dealer.images.map((image, index) => <img key={index} src={image} className={'w-full mb-4 object-cover object-center rounded-xl aspect-[20/7]'} alt={image}/>)}
            </CustomCarousel>
        </div>
        <div className={'grid grid-cols-4'}>
            <div className={'col-span-3'}>
                <Title>Description</Title>
                <Paragraph>{dealer.description}</Paragraph>
            </div>
            <div className={'space-y-4 flex flex-col justify-center items-end'}>
                <div>
                    <Title className={'!leading-none !my-0'}>{dealer.listing_count}</Title>
                    <Text className={'!leading-none !mt-0 !mb-4'} type={'secondary'}>Listings</Text>

                    <Title className={'!leading-none !my-0'}>{dealer.sold_count}</Title>
                    <Text className={'!leading-none !mt-0 !mb-4'} type={'secondary'}>Sold Vehicles</Text>

                    <Title className={'!leading-none !my-0'}>{dealer.views}</Title>
                    <Text className={'!leading-none !mt-0 !mb-4'} type={'secondary'}>Views</Text>
                </div>
            </div>
        </div>
        <div className={'py-8 space-y-8'}>
            <Title level={2} className={'leading-none !my-0'}>Listings</Title>
            <div className={'grid grid-cols-4 gap-8 mt-4'}>
                {listings.map((listing, index) => <ListingComponent listing={listing} key={index}/>)}
            </div>
        </div>
    </div>)
}
