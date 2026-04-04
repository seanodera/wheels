import type {CarAuction, CarItem} from "@/types";
import {useEffect, useState} from "react";
import {HighlightBackground} from "@/components/common.tsx";
import {ClockCircleOutlined} from "@ant-design/icons";
import {isCarAuction, toMoneyFormat} from "@/utils";
import {Typography} from "antd";

const {Title, Text} = Typography;

export default function CarouselItem({featured}: { featured: CarAuction | CarItem }) {
    const [countDown, setCountDown] = useState("");

    const title = `${featured.year} ${featured.brand} ${featured.model}`;
    const specLine = [featured.mileage ? `${featured.mileage.toLocaleString()} KM` : null, featured.engine, featured.transmission]
        .filter(Boolean)
        .join(" · ");
    const promoCopy = [
        `${featured.year} ${featured.brand} ${featured.model}`,
        featured.body ? `${featured.body.toLowerCase()} profile` : null,
        featured.fuelType ? `${featured.fuelType.toLowerCase()} power` : null,
        featured.transmission ? `${featured.transmission.toLowerCase()} transmission` : null,
    ]
        .filter(Boolean)
        .join(" with ");
    const heroImage = featured.images[0] || "/placeholder.jpg";
    const thumbnails = Array.from({length: 4}, (_, index) => featured.images[index + 1] || heroImage);

    useEffect(() => {
        if (!("ending" in featured)) {
            setCountDown("");
            return;
        }

        const updateCountdown = () => {
            const diff = new Date(featured.ending).getTime() - Date.now();

            if (diff <= 0) {
                setCountDown("Ended");
                return;
            }

            const totalMinutes = Math.floor(diff / 60000);
            const totalHours = Math.floor(totalMinutes / 60);
            const days = Math.floor(totalHours / 24);

            if (days > 0) {
                setCountDown(`${days} day${days > 1 ? "s" : ""}`);
                return;
            }

            if (totalHours > 0) {
                setCountDown(`${totalHours} hour${totalHours > 1 ? "s" : ""}`);
                return;
            }

            setCountDown(`${totalMinutes} min${totalMinutes > 1 ? "s" : ""}`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);

        return () => clearInterval(interval);
    }, [featured]);

    return (
        <div className="mb-4">
            <div className="lg:hidden grid grid-cols-2 grid-rows-3 gap-2">
                <div className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
                    <img
                        src={heroImage}
                        className="aspect-2.5/1 w-full object-cover"
                        alt={title}
                    />

                    <div className="absolute inset-0 flex h-full w-full flex-col justify-between bg-linear-to-t from-black/80 via-black/20 to-black/10 p-3">
                        <div className="flex items-start justify-between gap-2">
                            <HighlightBackground>Featured</HighlightBackground>
                            <div className="max-w-[64%] rounded-xl bg-black/30 px-2.5 py-2 backdrop-blur-md">
                                <Title level={5} className="my-0! text-base! leading-tight text-white!">
                                    {title}
                                </Title>
                                <Text className="my-0! block text-[11px] leading-snug text-white/80!">
                                    {featured.mileage.toLocaleString()} KM{featured.engine ? ` · ${featured.engine}` : ""}
                                </Text>
                            </div>
                        </div>

                        <div className="flex items-end justify-between gap-2">
                            {isCarAuction(featured) ? (
                                <div className="flex max-w-max items-center gap-2 rounded-xl bg-black/45 px-2.5 py-1.5 backdrop-blur-md">
                                    <span className="flex items-center gap-1">
                                        <Text className="my-0 text-xs leading-none text-white/75!">
                                            <ClockCircleOutlined/>
                                        </Text>
                                        <Text className="my-0 text-xs font-medium leading-none text-white!">
                                            {countDown}
                                        </Text>
                                    </span>
                                    <span>
                                        <Text className="my-0 text-[10px] leading-none text-white/75!">Bid</Text>
                                        <Text className="my-0 text-xs font-medium leading-none text-white!">
                                            {" "}KSH {toMoneyFormat(featured.currentBid ?? 0, true)}
                                        </Text>
                                    </span>
                                </div>
                            ) : (
                                <div className="max-w-max rounded-xl bg-black/45 px-2.5 py-1.5 backdrop-blur-md">
                                    <Text className="my-0 text-xs font-medium leading-none text-white!">
                                        KSH {toMoneyFormat(featured.price, true)}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {thumbnails.map((img, index) => (
                    <div
                        key={`${title}-mobile-${index}`}
                        className="overflow-hidden rounded-xl"
                    >
                        <img
                            src={img}
                            alt={`${title} preview ${index + 1}`}
                            className="aspect-video h-full w-full object-cover"
                        />
                    </div>
                ))}
            </div>

            <div className="hidden overflow-hidden rounded-3xl border border-black/10 bg-light-accent shadow-md dark:border-white/10 dark:bg-dark glass-card lg:block">
                <div className="grid grid-cols-[1.15fr_0.85fr]">
                    <div className="relative">
                        <img
                            src={heroImage}
                            className="h-full w-full object-cover aspect-video"
                            alt={title}
                        />

                        <div className="absolute inset-0 flex h-full w-full flex-col justify-between bg-linear-to-t from-black/80 via-black/20 to-black/10 p-6">
                            <div className="flex items-start justify-between gap-3">
                                <HighlightBackground>Featured</HighlightBackground>
                                <div className="max-w-[78%] rounded-2xl bg-black/30 p-4 backdrop-blur-md">
                                    <Title level={4} className="my-0! leading-tight text-white!">
                                        {title}
                                    </Title>
                                    <Text className="my-0! block leading-snug text-white/80!">
                                        {specLine}
                                    </Text>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div className="max-w-max rounded-2xl bg-black/45 px-3 py-2 backdrop-blur-md">
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.22em] text-white/65!">
                                        {isCarAuction(featured)? "Current Bid" : "Asking Price"}
                                    </Text>
                                    <Title level={4} className="my-0! leading-none text-white!">
                                        KSH {toMoneyFormat(isCarAuction(featured) ? featured.currentBid ?? 0 : featured.price ?? 0, true)}
                                    </Title>
                                </div>

                                {isCarAuction(featured) && (
                                    <div className="flex max-w-max items-center gap-2 rounded-2xl bg-black/45 px-3 py-2 backdrop-blur-md">
                                        <Text className="my-0 leading-none text-white/75!">
                                            <ClockCircleOutlined/>
                                        </Text>
                                        <div>
                                            <Text className="block text-[11px]! uppercase tracking-[0.18em] text-white/65!">
                                                Time Left
                                            </Text>
                                            <Text className="my-0 font-medium leading-none text-white!">{countDown}</Text>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-5 p-7">
                        <div className="space-y-3">
                            <Text className="block text-[11px]! uppercase tracking-[0.28em] text-black/45 dark:text-white/45">
                                Showcase Vehicle
                            </Text>
                            <Title level={2} className="mb-0! leading-[1.02] text-black dark:text-white">
                                {featured.year} {featured.brand}
                                <br/>
                                {featured.model}
                            </Title>
                            <Text className="block max-w-md text-sm text-black/65 dark:text-white/70">
                                {promoCopy}.
                            </Text>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                {label: "Year", value: featured.year},
                                {label: "Body", value: featured.body},
                                {label: "Fuel", value: featured.fuelType},
                                {label: "Drive", value: featured.drivetrain ?? "Standard"},
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-black/10 bg-white/55 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                                >
                                    <Text className="mb-1! block text-[11px]! uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
                                        {item.label}
                                    </Text>
                                    <Text className="text-sm font-medium text-black dark:text-white">
                                        {item.value}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {thumbnails.map((img, index) => (
                                <div
                                    key={`${title}-${index}`}
                                    className="overflow-hidden rounded-2xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5"
                                >
                                    <img
                                        src={img}
                                        alt={`${title} preview ${index + 1}`}
                                        className="h-16 w-full object-cover sm:h-20"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
