import { Outlet } from "react-router-dom"
import Footer from "./Component/Footer"
import Navbar from "./Component/Navbar"

export default function Layout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer/>

        </>
    )
}