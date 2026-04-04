import {useEffect, useMemo, useState} from "react";
import {AutoComplete, Avatar, Button, Drawer, Segmented, Tooltip, Typography} from "antd";
import {Link, useLocation, useNavigate} from "react-router";
import {motion} from "framer-motion";
import LogoComponent from "@/assets/logoComponent.tsx";
import {useAppDispatch, useAppSelector} from "@/store/hooks.ts";
import {CloseOutlined, MenuOutlined, MoonOutlined, SearchOutlined, SunOutlined, UserOutlined} from "@ant-design/icons";
import {fetchAuctionsAsync, fetchListingAsync, setActiveTab, setQuery, setTheme} from "@/store";

const {Title,Text} = Typography;

const navItems = [
    {to: "/auctions", label: "Auctions", description: "Live bidding and upcoming drops"},
    {to: "/listings", label: "Listings", description: "Browse cars ready to buy"},
    {to: "/dealers", label: "Dealers", description: "Find trusted sellers near you"},
];

export default function Navbar() {
    const [searchValue, setSearchValue] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const {theme} = useAppSelector(state => state.main)
    const user = useAppSelector((state) => state.authentication.user);
    const {auctions, auctionsFetched} = useAppSelector((state) => state.auction);
    const {listings, fetchedPages} = useAppSelector((state) => state.listing);

    useEffect(() => {
        if (!auctionsFetched && !auctions.length) {
            dispatch(fetchAuctionsAsync());
        }

        if (!fetchedPages.length && !listings.length) {
            dispatch(fetchListingAsync({page: 1, pageSize: 24}));
        }
    }, [auctions.length, auctionsFetched, dispatch, fetchedPages.length, listings.length]);

    const suggestionPool = useMemo(() => {
        const values = [
            ...auctions.flatMap((item) => [item.name, `${item.year} ${item.brand} ${item.model}`, item.brand, item.model, item.body]),
            ...listings.flatMap((item) => [item.name, `${item.year} ${item.brand} ${item.model}`, item.brand, item.model, item.body]),
        ]
            .filter((value): value is string => Boolean(value?.trim()));

        return Array.from(new Set(values)).slice(0, 40);
    }, [auctions, listings]);

    const options = useMemo(() => {
        const normalizedValue = searchValue.trim().toLowerCase();
        const filteredValues = normalizedValue
            ? suggestionPool.filter((value) => value.toLowerCase().includes(normalizedValue))
            : suggestionPool;

        return filteredValues.slice(0, 8).map((value) => ({value}));
    }, [searchValue, suggestionPool]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    const handleSearchSubmit = (value: string) => {
        const normalizedValue = value.trim();
        setSearchValue(normalizedValue);
        dispatch(setActiveTab("all"));
        dispatch(setQuery(normalizedValue));
        setIsSearchOpen(false);
        setIsMenuOpen(false);
        navigate("/search");
    };


    return (
        <>
            {/* Navbar Container */}
            <div
                className="sticky top-0 left-0 right-0 z-50 flex w-full items-center justify-between gap-3 border-b border-black/5 bg-white/95 px-4 py-3 shadow-lg backdrop-blur md:px-6 lg:px-8 xl:px-10 dark:border-white/10 dark:bg-black/75">
                {/* Left Section (Logo + Links) */}
                <div className="flex min-w-0 items-center gap-3 xl:gap-6">
                    <Link to="/" className="flex min-w-0 items-center gap-3">
                        <Avatar className="animate-spin duration-1000" shape="square" size="large"
                                src={<LogoComponent className="text-primary"/>}/>
                        <div className="min-w-0">
                            <Title className="my-0! leading-none" level={4}>Wheels</Title>
                            <Text className="hidden text-xs uppercase tracking-[0.22em] text-black/45 xl:block dark:text-white/45">
                                By Serid
                            </Text>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden xl:flex items-center gap-1 rounded-2xl bg-slate-100/80 p-1 dark:bg-white/10">
                        {navItems.map((item) => (
                            <NavbarItem
                                key={item.to}
                                to={item.to}
                                currentPath={location.pathname}
                                animated
                            >
                                {item.label}
                            </NavbarItem>
                        ))}
                    </div>
                </div>

                {/* Right Section (Search + User/Profile/Login) */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Search Button (Mobile) */}
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden text-xl">
                        <SearchOutlined/>
                    </button>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:block">
                        <AutoComplete
                            size="large"
                            options={options}
                            value={searchValue}
                            onSelect={handleSearchSubmit}
                            onChange={handleSearch}
                            showSearch={{onSearch: handleSearch}}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    handleSearchSubmit((event.target as HTMLInputElement).value);
                                }
                            }}
                            placeholder="Search cars, brands, or body styles"
                            className="w-52 lg:w-72"
                            variant="filled"
                        />
                    </div>

                    {/* User Profile / Login */}
                    {user ? (
                        <div className={'hidden md:flex items-center gap-2'}>
                            <Segmented
                                onChange={(value) => dispatch(setTheme(value as "light" | "dark"))}
                                shape="round"
                                options={[
                                    {value: "light", icon: <SunOutlined/>},
                                    {value: "dark", icon: <MoonOutlined/>},
                                ]}
                                value={theme}
                            />
                            <Tooltip title="Manage saved cars and alerts">
                                <Link to="/profile" className="flex items-center gap-2 rounded-2xl px-2 py-1 transition-colors hover:bg-slate-100 dark:hover:bg-white/10">
                                    <div className="hidden text-right xl:block">
                                        <Title className="leading-none! my-0!" level={5}>{user.firstName} {user.lastName}</Title>
                                    </div>
                                <Avatar src={user.profilePicture} icon={!user.profilePicture && <UserOutlined/>}
                                        size="large" shape="circle"/>
                                </Link>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Segmented
                                onChange={(value) => dispatch(setTheme(value as "light" | "dark"))}
                                shape="round"
                                options={[
                                    {value: "light", icon: <SunOutlined/>},
                                    {value: "dark", icon: <MoonOutlined/>},
                                ]}
                                value={theme}
                            />
                            <Link to="/login"><Button size="large" type="primary">Login</Button></Link>
                            <Link to="/sign-up"><Button size="large" type="primary" ghost>Sign up</Button></Link>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <Button onClick={() => setIsMenuOpen(true)} icon={<MenuOutlined/>} type={'text'} className="xl:hidden text-2xl"/>
                </div>
            </div>

            {/* Mobile Search Bar (Animated) */}
            {isSearchOpen && (
                <motion.div
                    initial={{y: "100%", opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    exit={{y: "100%", opacity: 0}}
                    transition={{duration: 0.3}}
                    className="md:hidden border-b border-black/5 bg-white/95 p-4 shadow-lg z-50 flex items-center justify-center gap-2 dark:border-white/10 dark:bg-black/85"
                >
                    <AutoComplete
                        size="large"
                        options={options}
                        value={searchValue}
                        onSelect={handleSearchSubmit}
                        onChange={handleSearch}
                        showSearch={{onSearch: handleSearch}}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSearchSubmit((event.target as HTMLInputElement).value);
                            }
                        }}
                        placeholder="Search cars, brands, or body styles"
                        className="w-full"
                        variant="filled"
                    />
                    <button onClick={() => setIsSearchOpen(false)} className="ml-2 text-xl">
                        <CloseOutlined/>
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
                size={280}
                className={'dark:bg-dark-bg!'}
            >
                <div className="flex flex-col h-full justify-between gap-4">
                    <div className={'flex flex-1 flex-col gap-6'}>
                        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
                            <Tooltip title="Look up vehicles by brand, model, or category.">
                                <Text className="mb-3 block text-sm text-slate-600 dark:text-slate-300">
                                    Search smarter
                                </Text>
                            </Tooltip>
                            <AutoComplete
                                size="large"
                                options={options}
                                value={searchValue}
                                onSelect={handleSearchSubmit}
                                onChange={handleSearch}
                                showSearch={{onSearch: handleSearch}}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSearchSubmit((event.target as HTMLInputElement).value);
                                    }
                                }}
                                placeholder="Search inventory"
                                className="w-full"
                                variant="filled"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            {navItems.map((item) => (
                                <NavbarItem
                                    key={item.to}
                                    to={item.to}
                                    description={item.description}
                                    currentPath={location.pathname}
                                    onClick={() => setIsMenuOpen(false)}
                                    animated={false}
                                >
                                    {item.label}
                                </NavbarItem>
                            ))}
                        </div>

                        {user ? (
                            <Tooltip title="Open profile, saved cars, and alerts">
                                <Link to="/profile" className="flex gap-3 items-center rounded-2xl bg-slate-100 p-4 dark:bg-white/10" onClick={() => setIsMenuOpen(false)}>
                                <Avatar src={user.profilePicture} icon={!user.profilePicture && <UserOutlined/>}
                                        size="large"/>
                                <div>
                                    <Title className="leading-none! my-0!" level={5}>{user.firstName} {user.lastName}</Title>
                                </div>
                                </Link>
                            </Tooltip>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Tooltip title="Sign in to save searches, track bids, and get matched with dealers.">
                                    <Text className="text-sm text-slate-500 dark:text-slate-300">
                                        Sign in for a better experience
                                    </Text>
                                </Tooltip>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)}><Button size="large" type="primary"
                                                          className="w-full">Login</Button></Link>
                                <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}><Button size="large" type="primary" ghost className="w-full">Sign
                                    up</Button></Link>
                            </div>
                        )}
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-4 dark:bg-dark">
                        <Tooltip title="Choose between light and dark themes.">
                            <Text type="secondary" className="mb-2 block text-xs uppercase tracking-wide">
                                Appearance
                            </Text>
                        </Tooltip>

                        <Segmented
                            block
                            onChange={(value) => dispatch(setTheme(value as "light" | "dark"))}
                            shape="round"
                            options={[
                                { value: "light", icon: <SunOutlined /> },
                                { value: "dark", icon: <MoonOutlined /> },
                            ]}
                            value={theme}
                        />
                    </div>
                </div>
            </Drawer>
        </>
    );
}

/* Navbar Item Component */
function NavbarItem({
    to,
    children,
    description,
    currentPath,
    onClick,
    animated = false,
}: {
    to: string,
    children: React.ReactNode,
    description?: string,
    currentPath?: string,
    onClick?: () => void,
    animated?: boolean,
}) {
    const isActive = currentPath === to;

    return (
        <Link to={to} onClick={onClick}>
            <div
                className={`relative w-full rounded-2xl px-4 py-3 text-left transition-all duration-300 ${isActive ? "text-accent" : "text-dark dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"}`}
            >
                {isActive && animated && (
                    <motion.div
                        layoutId="navbar-active-pill"
                        transition={{type: "spring", stiffness: 360, damping: 30}}
                        className="absolute inset-0 rounded-2xl bg-primary/10 ring-1 ring-primary/20"
                    />
                )}
                {isActive && !animated && (
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 ring-1 ring-primary/20"/>
                )}
                <Tooltip title={description}>
                    <span className="relative z-10 block font-medium">{children}</span>
                </Tooltip>
            </div>
        </Link>
    );
}
