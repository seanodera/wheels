import {Route, Routes} from 'react-router-dom'
import './App.css'
import MainShell from "./shells/mainShell.tsx";
import HomeScreen from "./screens/homeScreen.tsx";
import LoginScreen from "./screens/loginScreen.tsx";
import SignUpScreen from "./screens/signUpScreen.tsx";
import AuctionScreen from "@/screens/auctionScreen.tsx";

function App() {

    return (
        <div>
            <Routes>
                <Route element={<MainShell/>}>
                    <Route path={'/'} element={<HomeScreen/>}/>
                    <Route path={'/auction/:id'} element={<AuctionScreen/>}/>
                </Route>
                <Route path={'/login'} element={<LoginScreen/>}/>
                <Route path={'/sign-up'} element={<SignUpScreen/>}/>
            </Routes>
        </div>
    )
}

export default App
