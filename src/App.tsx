import {Route, Routes} from 'react-router-dom'
import './App.css'
import MainShell from "./shells/mainShell.tsx";
import HomeScreen from "./screens/homeScreen.tsx";
import LoginScreen from "./screens/loginScreen.tsx";
import SignUpScreen from "./screens/signUpScreen.tsx";
import AuctionScreen from "@/screens/auctionScreen.tsx";
import DealerScreen from "@/screens/dealerScreen.tsx";
import SingleDealer from "@/screens/singleDealer.tsx";
import ListingScreen from "@/screens/listingScreen.tsx";
import AuctionsScreen from "@/screens/auctionsScreen.tsx";
import ProfileScreen from "@/screens/profileScreen.tsx";
import ListingsScreen from "@/screens/listingsScreen.tsx";

function App() {

    return (
        <div>
            <Routes>
                <Route element={<MainShell/>}>
                    <Route path={'/'} element={<HomeScreen/>}/>
                    <Route path={'/dealers'} element={<DealerScreen/>}/>
                    <Route path={'/dealers/:id'} element={<SingleDealer/>}/>
                    <Route path={'/auction/:id'} element={<AuctionScreen/>}/>
                    <Route path={'/auctions'} element={<AuctionsScreen/>}/>
                    <Route path={'/listings'} element={<ListingsScreen/>}/>
                    <Route path={'/listing/:id'} element={<ListingScreen/>}/>
                    <Route path={'/profile'} element={<ProfileScreen/>}/>
                </Route>
                <Route path={'/login'} element={<LoginScreen/>}/>
                <Route path={'/sign-up'} element={<SignUpScreen/>}/>
            </Routes>
        </div>
    )
}

export default App
