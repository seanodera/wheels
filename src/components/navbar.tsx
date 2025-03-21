import { useState } from "react";
import { AutoComplete, Avatar, Button, Typography, Drawer } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LogoComponent from "@/assets/logoComponent.tsx";
import { useAppSelector } from "@/hooks.ts";
import { UserOutlined, MenuOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const carOptions = [
    { value: "Toyota Corolla" },
    { value: "Honda Civic" },
    { value: "Ford Mustang" },
    { value: "BMW 3 Series" },
    { value: "Mercedes-Benz C-Class" },
    { value: "Tesla Model S" },
    { value: "Nissan Altima" },
    { value: "Chevrolet Camaro" },
    { value: "Volkswagen Golf" },
];

export default function Navbar() {
    const [options, setOptions] = useState(carOptions);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = useAppSelector((state) => state.authentication.user);

    const handleSearch = (value: string) => {
        if (!value) {
            setOptions(carOptions);
        } else {
            setOptions(carOptions.filter(car => car.value.toLowerCase().includes(value.toLowerCase())));
        }
    };

    return (
        <>
            {/* Navbar Container */}
            <div className="flex w-screen px-4 md:px-16 py-3 justify-between items-center shadow-lg top-0 left-0 right-0 z-50">
                {/* Left Section (Logo + Links) */}
                <div className="flex items-center gap-6">
                    <Link to="/" className="flex gap-2 items-center">
                        <Avatar className="animate-spin" shape="square" size="large" src={<LogoComponent className="text-primary" />} />
                        <Title className="leading-none !my-0" level={4}>Wheela</Title>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-2 items-center">
                        <NavbarItem to="/auctions">Auctions</NavbarItem>
                        <NavbarItem to="/listings">Listings</NavbarItem>
                        <NavbarItem to="/dealers">Dealers</NavbarItem>
                    </div>
                </div>

                {/* Right Section (Search + User/Profile/Login) */}
                <div className="flex items-center gap-4">
                    {/* Search Button (Mobile) */}
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden text-xl">
                        <SearchOutlined />
                    </button>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:block">
                        <AutoComplete
                            size="large"
                            options={options}
                            onSearch={handleSearch}
                            placeholder="Search for cars..."
                            className="w-60"
                            variant="filled"
                        />
                    </div>

                    {/* User Profile / Login */}
                    {user ? (
                        <Link to="/profile" className="hidden md:flex gap-2 items-center">
                            <div>
                                <Title className="!leading-none !my-0" level={5}>{user.firstName} {user.lastName}</Title>
                                <Text className="!leading-none !my-0" type="secondary">{user.username}</Text>
                            </div>
                            <Avatar src={user.profilePicture} icon={!user.profilePicture && <UserOutlined />} size="large" shape="circle" />
                        </Link>
                    ) : (
                        <div className="hidden md:flex gap-2">
                            <Link to="/login"><Button size="large" type="primary">Login</Button></Link>
                            <Link to="/sign-up"><Button size="large" type="primary" ghost>Sign up</Button></Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-white text-2xl">
                        <MenuOutlined />
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar (Animated) */}
            {isSearchOpen && (
                <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:hidden bottom-0 left-0 right-0  shadow-lg p-4 z-50 flex justify-center"
                >
                    <AutoComplete
                        size="large"
                        options={options}
                        onSearch={handleSearch}
                        placeholder="Search for cars..."
                        className="w-11/12"
                        variant="filled"
                    />
                    <button onClick={() => setIsSearchOpen(false)} className="ml-2 text-xl">
                        <CloseOutlined />
                    </button>
                </motion.div>
            )}

            {/* Mobile Menu (Drawer) */}
            <Drawer
                title="Menu"
                placement="right"
                closable
                onClose={() => setIsMenuOpen(false)}
                open={isMenuOpen}
            >
                <div className="flex flex-col gap-4">
                    <NavbarItem to="/auctions">Auctions</NavbarItem>
                    <NavbarItem to="/listings">Listings</NavbarItem>
                    <NavbarItem to="/dealers">Dealers</NavbarItem>
                    {user ? (
                        <Link to="/profile" className="flex gap-2 items-center">
                            <Avatar src={user.profilePicture} icon={!user.profilePicture && <UserOutlined />} size="large" />
                            <div>
                                <Title className="!leading-none !my-0" level={5}>{user.firstName} {user.lastName}</Title>
                                <Text className="!leading-none !my-0" type="secondary">{user.username}</Text>
                            </div>
                        </Link>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link to="/login"><Button size="large" type="primary" className="w-full">Login</Button></Link>
                            <Link to="/sign-up"><Button size="large" type="primary" ghost className="w-full">Sign up</Button></Link>
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    );
}

/* Navbar Item Component */
function NavbarItem({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <Link to={to}>
            <Button className="transition-all duration-500" size="large" type="text">
                {children}
            </Button>
        </Link>
    );
}
