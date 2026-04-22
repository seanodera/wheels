import { Avatar, Button, Typography } from "antd";
import LogoComponent from "@/assets/logoComponent.tsx";
import { Link, useLocation } from "react-router";

const { Title,Text } = Typography;

export default function Footer() {
    return (
        <div className=" bg-primary dark:bg-dark pt-20 md:pt-24 xl:pt-28 2xl:pt-36 px-4 md:px-8 xl:px-12 2xl:px-16 flex flex-col justify-end min-h-[30vh]">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Logo Section */}
                <div>
                    <div className="flex gap-2 items-center">
                        <Avatar className="animate-spin duration-1000" shape="square" size="large"
                                src={<LogoComponent className="text-dark dark:text-white"/>}/>
                        <div>
                            <Title className="leading-none my-0!" level={4}>Wheels</Title>
                            <Text className="text-xs uppercase tracking-[0.22em] text-white/65">
                                By Serid
                            </Text>
                        </div>
                    </div>
                    <Text className="mt-4 block max-w-xs text-sm text-white/70">
                        Wheels is Serid's automotive marketplace for listings, live auctions, and dealer discovery.
                    </Text>
                </div>


                {/* SELLING */}
                <FooterSection title="Selling">
                    <FooterItem to="/sell-with-us">Sell a Car</FooterItem>
                    <FooterItem to="/pricing">Fees & Pricing</FooterItem>
                    <FooterItem to="/auctions">Browse Auctions</FooterItem>
                </FooterSection>

                {/* MARKETPLACE */}
                <FooterSection title="Marketplace">
                    <FooterItem to="/auctions">Auctions</FooterItem>
                    <FooterItem to="/listings">Listings</FooterItem>
                    <FooterItem to="/search">Search</FooterItem>
                </FooterSection>

                {/* COMPANY */}
                <FooterSection title="Wheels">
                    <FooterItem to="/about">About</FooterItem>
                    <FooterItem to="/contact">Contact</FooterItem>
                </FooterSection>
                {/* Empty Section for Layout Balance */}
                <div></div>
            </div>
            <div className={'flex flex-col-reverse max-md:items-center md:grid md:grid-cols-3 py-4 mt-8'}>
                <div className={'leading-none mx-auto my-0!'}></div>
                <Text className={'leading-none mx-auto my-0! text-center'} type={'secondary'}>&copy; Copyright {new Date().getFullYear()} Serid · Wheels</Text>
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
        <div className="flex flex-col max-md:items-center gap-4">
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
                className={`transition-all duration-500 ${className} ${isActive? activeClassName : className} ${!className && isActive ? 'dark:text-primary! text-white!' : ''}`}
                type="text"
            >
                {children}
            </Button>
        </Link>
    );
}
