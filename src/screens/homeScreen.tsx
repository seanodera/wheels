import HomeBanner from "@/components/home/banner.tsx";
import AuctionsEndingSoon from "@/components/home/auctionsEndingSoon.tsx";
import NewListings from "@/components/home/newListings.tsx";
import NewDealers from "@/components/home/newDealers.tsx";
import PopularListings from "@/components/home/popularListings.tsx";
import PopularDealers from "@/components/home/popularDealers.tsx";



export default function HomeScreen() {

    return <div>
        <HomeBanner/>
        <div className={'px-4 lg:px-16'}>
            <AuctionsEndingSoon/>
            <NewListings/>
            <NewDealers/>
            <PopularListings/>
            <PopularDealers/>
        </div>
    </div>
}
