import {Route, Routes} from 'react-router'
import './App.css'
import {App as AntApp, ConfigProvider, theme} from "antd";
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

function App() {
    const currentTheme = useThemeManager();
    const {darkAlgorithm, defaultAlgorithm} = theme;
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        const id = setTimeout(() => setLoading(false), 50); // small delay to show loader
        return () => clearTimeout(id);
    }, [location.pathname]);

    if (loading) return <LoadingScreen/>;
    return (
        <ConfigProvider
            theme={
                currentTheme === "light"
                    ? {
                        token: {
                            colorPrimary: "#00e5ff",
                            colorInfo: "#00e5ff",
                            colorLink: "#00e5ff",
                            borderRadius: 8,
                            wireframe: false,

                        },

                        algorithm: defaultAlgorithm, // ✅ light algorithm
                        components: {
                            Button: {
                                colorPrimary: "#001315"
                            },
                            Card: {
                                lineType: ""
                            },
                            Layout: {
                                headerBg: "#FFFFFF",
                            }
                        },
                    }
                    : {
                        token: {
                            colorPrimary: "#00e5ff",
                            colorInfo: "#00e5ff",
                            borderRadius: 8,
                            wireframe: false,
                            colorBgBase: "#000506",

                        },
                        algorithm: darkAlgorithm, // ✅ dark algorithm
                        components: {
                            Layout: {
                                headerBg: "#040100",
                            },
                            Card: {
                                lineType: ""
                            }
                        },
                    }}
        >
           <ErrorBoundary>
               <AntApp>

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
               </AntApp>
           </ErrorBoundary>

        </ConfigProvider>
    )
}

export default App
