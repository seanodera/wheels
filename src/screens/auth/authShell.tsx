import type {ReactNode} from "react";
import {Avatar, Typography} from "antd";
import {Link} from "react-router";
import LogoComponent from "@/assets/logoComponent.tsx";

const {Title} = Typography;

export default function AuthShell({children}: {children: ReactNode}) {
    return (
        <div className="flex min-h-screen w-screen flex-col items-center justify-between bg-dark-950 px-8 py-2">
            <Link to="/" className="w-full flex items-center justify-start">
                <div className="flex items-center gap-2 text-primary">
                    <Avatar
                        shape="square"
                        size="large"
                        src={<LogoComponent className="text-primary"/>}
                        className="text-primary"
                    />
                    <Title level={4} className="my-0 leading-none">
                        Wheela
                    </Title>
                </div>
            </Link>

            <div className="w-full max-w-md">
                {children}
            </div>

            <div className="flex items-center justify-center gap-4">
                <Link to="/privacy" className="text-gray-500 hover:text-primary hover:underline">Terms Of Service</Link>
                <Link to="/privacy" className="text-gray-500 hover:text-primary hover:underline">Privacy Policy</Link>
                <Link to="/privacy" className="text-gray-500 hover:text-primary hover:underline">Security</Link>
            </div>
        </div>
    );
}
