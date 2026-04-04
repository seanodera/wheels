import {Route, Routes} from 'react-router'
import './App.css'
import {App as AntApp, ConfigProvider} from "antd";
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
import ErrorBoundary from "./errorBoundary.tsx";
import {useThemeManager} from "@/utils/useThemeManager.ts";
import {useLocation} from "react-router";
import {useEffect, useState} from "react";
import LoadingScreen from "@/components/navigation/loadingScreen.tsx";
import MessagesScreen from "@/screens/messages.tsx";
import useGlassTheme from "@/glassTheme.ts";
import SearchScreen from "@/screens/searchScreen.tsx";

function App() {
    const currentTheme = useThemeManager();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const configTheme = useGlassTheme(currentTheme);

    useEffect(() => {
        setLoading(true);
        const id = setTimeout(() => setLoading(false), 50); // small delay to show loader
        return () => clearTimeout(id);
    }, [location.pathname]);

    if (loading) return <LoadingScreen/>;

    return (
        <ConfigProvider
            theme={configTheme}
        >
            <div className={'glass-theme bg-light-bg dark:text-white min-h-screen dark:bg-dark-bg transition-colors'}>

                <ErrorBoundary>

                    <AntApp>
                        <div className={'min-h-screen'}>
                            <Routes>
                                <Route element={<MainShell/>}>
                                    <Route path={'/messages'} element={<MessagesScreen/>}/>
                                    <Route path={'/'} element={<HomeScreen/>}/>
                                    <Route path={'/dealers'} element={<DealerScreen/>}/>
                                    <Route path={'/dealers/:id'} element={<SingleDealer/>}/>
                                    <Route path={'/auction/:id'} element={<AuctionScreen/>}/>
                                    <Route path={'/auctions'} element={<AuctionsScreen/>}/>
                                    <Route path={'/listings'} element={<ListingsScreen/>}/>
                                    <Route path={'/search'} element={<SearchScreen/>}/>
                                    <Route path={'/listing/:id'} element={<ListingScreen/>}/>
                                    <Route path={'/profile'} element={<ProfileScreen/>}/>
                                </Route>
                                <Route path={'/login'} element={<LoginScreen/>}/>
                                <Route path={'/sign-up'} element={<SignUpScreen/>}/>
                            </Routes>
                        </div>
                    </AntApp>

                </ErrorBoundary>
            </div>

        </ConfigProvider>
    )
}

export default App
