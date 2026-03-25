import HomeBanner from "@/components/home/banner.tsx";
import AuctionsEndingSoon from "@/components/home/auctionsEndingSoon.tsx";
import NewListings from "@/components/home/newListings.tsx";
import NewDealers from "@/components/home/newDealers.tsx";
import PopularListings from "@/components/home/popularListings.tsx";
import PopularDealers from "@/components/home/popularDealers.tsx";
import {useEffect} from "react";
import {fetchHomeData, useAppDispatch, useAppSelector} from "@/store";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";


export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const {loading, fetched} = useAppSelector((state) => state.wheels);

    useEffect(() => {
        if (!fetched && !loading) {
            dispatch(fetchHomeData())
        }
    }, []);
    if (loading) {
        return  <LoadingScreen/>
    }
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
