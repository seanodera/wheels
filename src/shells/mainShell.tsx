import Navbar from "@/components/navbar.tsx";
import {Outlet} from "react-router-dom";


export default function mainShell() {

    return <div className={'bg-dark-700 min-h-screen'}>
        <Navbar/>
        <Outlet/>
    </div>
}
