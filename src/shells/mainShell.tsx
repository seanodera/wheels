import Navbar from "@/components/navbar.tsx";
import {Outlet} from "react-router-dom";
import Footer from "@/components/footer.tsx";
import {useEffect} from "react";
import {useAppDispatch} from "@/hooks.ts";
import {autoLoginUser} from "@/features/authenticationSlice.ts";


export default function MainShell() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(autoLoginUser())

    }, [dispatch])

    return <div className={'bg-dark-700 min-h-screen w-screen'}>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
}
