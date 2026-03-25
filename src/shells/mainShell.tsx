import Navbar from "@/components/navigation/navbar.tsx";
import {Outlet} from "react-router";
import Footer from "@/components/footer.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {autoLoginUser} from "@/store/reducers/authenticationSlice.ts";
import {fetchHomeData} from "@/store/reducers/wheelsSlice.ts";


export default function MainShell() {
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector((state) => state.wheels);
    useEffect(() => {
        dispatch(autoLoginUser())
        dispatch(fetchHomeData())
    }, [dispatch])
    if (loading) {
        return <div>Loading...</div>
    }
    return <div className={'min-h-screen h-full bg-gray-50 transition-all duration-300 dark:bg-dark-bg'}>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </div>
}
