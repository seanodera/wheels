import Navbar from "@/components/navigation/navbar.tsx";
import {Outlet, useLocation} from "react-router";
import Footer from "@/components/footer.tsx";
import {useEffect} from "react";
import {useAppDispatch} from "@/store/hooks.ts";
import {autoLoginUser} from "@/store/reducers/authenticationSlice.ts";


export default function MainShell() {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const isMessageRoute = location.pathname === "/messages";

    useEffect(() => {
        dispatch(autoLoginUser())

    }, [dispatch])
    return <div className={`${isMessageRoute ? "h-screen overflow-hidden" : "min-h-screen"} w-screen flex flex-col bg-gray-50 transition-all duration-300 dark:bg-dark-bg`}>
        <Navbar/>
        <div className={`${isMessageRoute ? "min-h-0 overflow-hidden" : ""} flex-1`}>
            <Outlet/>
        </div>
        {isMessageRoute ? null : <Footer/>}
    </div>
}
