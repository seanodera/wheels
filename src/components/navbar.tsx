import { AutoComplete, Avatar, Button, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import LogoComponent from "@/assets/logoComponent.tsx";

const { Title } = Typography;

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

    const handleSearch = (value: string) => {
        if (!value) {
            setOptions(carOptions);
        } else {
            setOptions(carOptions.filter(car => car.value.toLowerCase().includes(value.toLowerCase())));
        }
    };

    return (
        <div className={'flex w-screen px-16 py-3 justify-between shadow-lg '}>
            <div className={'flex gap-6 items-center'}>
                <div className={'flex gap-2 items-center'}>
                    <Avatar shape={"square"} size={'large'} src={<LogoComponent className={'text-primary'}/>} />
                    <Title className={"leading-none !my-0"} level={4}>Wheela</Title>
                </div>
                <div className={'flex gap-2 items-center'}>
                    <NavbarItem to={'/auctions'}>Auctions</NavbarItem>
                    <NavbarItem to={'/dealers'}>Dealers</NavbarItem>
                </div>
            </div>

            <div className={'flex gap-2 items-center'}>
                <AutoComplete
                    size={'large'}
                    options={options}
                    onSearch={handleSearch}
                    placeholder="Search for cars..."
                    className="w-60"
                    variant={'filled'}
                />
                <Button size={'large'} type={'primary'}>Login</Button>
                <Button size={'large'} type={'primary'} ghost>Sign up</Button>
            </div>
        </div>
    );
}

function NavbarItem({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <Link to={to}>
            <Button className={'transition-all duration-500'} size={'large'} type={'text'}>
                {children}
            </Button>
        </Link>
    );
}
