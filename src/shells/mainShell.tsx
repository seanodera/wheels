import Navbar from "@/components/navigation/navbar.tsx";
import {Outlet} from "react-router";
import Footer from "@/components/footer.tsx";
import {useEffect} from "react";
import {useAppDispatch} from "@/store/hooks.ts";
import {autoLoginUser} from "@/store/reducers/authenticationSlice.ts";


export default function MainShell() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(autoLoginUser())

    }, [dispatch])
    return <div className={'min-h-screen h-full bg-gray-50 transition-all duration-300 dark:bg-dark-bg'}>
        <Navbar/>
        <div className={'h-full'}>
            <Outlet/>
        </div>
        <Footer/>
    </div>
}
