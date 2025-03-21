import { Avatar, Button, Typography } from "antd";
import LogoComponent from "@/assets/logoComponent.tsx";
import { Link, useLocation } from "react-router-dom";

const { Title,Text } = Typography;

export default function Footer() {
    return (
        <div className="bg-dark-400/10 py-4 px-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Logo Section */}
                <div className="flex gap-2 items-center">
                    <Avatar shape="square" size="large" src={<LogoComponent className="text-primary" />} />
                    <Title className="leading-none !my-0" level={4}>Wheela</Title>
                </div>

                {/* How It Works */}
                <FooterSection title="How It Works">
                    <FooterItem to="/buyers">Buyers</FooterItem>
                    <FooterItem to="/sellers">Sellers</FooterItem>
                    <FooterItem to="/auctions">Auctions</FooterItem>
                </FooterSection>

                {/* Sellers */}
                <FooterSection title="Sellers">
                    <FooterItem to="/sell">Sell a Car</FooterItem>
                    <FooterItem to="/dealer">Dealer Services</FooterItem>
                    <FooterItem to="/pricing">Pricing</FooterItem>
                </FooterSection>

                {/* Company */}
                <FooterSection title="Wheela">
                    <FooterItem to="/about">About Us</FooterItem>
                    <FooterItem to="/contact">Contact</FooterItem>
                    <FooterItem to="/faq">FAQ</FooterItem>
                </FooterSection>

                {/* Empty Section for Layout Balance */}
                <div></div>
            </div>
            <div className={'flex flex-col-reverse md:grid md:grid-cols-3 py-4 mt-8'}>
                <div className={'leading-none mx-auto !my-0'}></div>
                <Text className={'leading-none mx-auto !my-0 text-center'} type={'secondary'}>&copy; Copyright 2025 Wheela</Text>
                <div className={'flex flex-col md:flex-row justify-end gap-2'}>
                    <FooterItem to={'/cookies'} className={'text-gray-500 hover:text-primary'} activeClassName={'text-white'}>Cookies
                        Policy</FooterItem>
                    <FooterItem to={'/privacy-policy'} className={'text-gray-500 hover:text-primary'}
                             activeClassName={'text-white'}>Privacy Policy</FooterItem>
                    <FooterItem to={'/terms-of-service'} className={'text-gray-500 hover:text-primary'}
                             activeClassName={'text-white'}>Terms of Service</FooterItem>
                </div>
            </div>
        </div>
    );
}

// Reusable Footer Section
function FooterSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <Title level={5}>{title}</Title>
            {children}
        </div>
    );
}

// Footer Link Item with Active Highlighting
function FooterItem({ to, children, className , activeClassName}: { to: string, children: React.ReactNode, className?: string,activeClassName?: string, }) {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to}>
            <Button
                className={`transition-all duration-500 ${className} ${isActive? activeClassName : className} ${!className && isActive ? 'text-primary' : ''}`}
                type="text"
            >
                {children}
            </Button>
        </Link>
    );
}
