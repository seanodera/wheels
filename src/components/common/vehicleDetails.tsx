import type {BaseCar} from "@/types";
import {Descriptions} from "antd";
import type {DescriptionsProps} from "antd";

export function VehicleDetails({listing}: { listing: BaseCar }) {
    const formatNumber = (value?: number) => value?.toLocaleString();
    const formatBoolean = (value?: boolean) => {
        if (value === undefined) return undefined;
        return value ? "Yes" : "No";
    };

    const items: DescriptionsProps["items"] = [
        {
            label: "Name",
            children: listing.name,
        },
        {
            label: "Year",
            children: listing.year,
        },
        {
            label: "Brand",
            children: listing.brand,
        },
        {
            label: "Model",
            children: listing.model,
        },
        {
            label: "Body",
            children: listing.body,
        },
        {
            label: "Mileage",
            children: formatNumber(listing.mileage),
        },
        {
            label: "Transmission",
            children: listing.transmission,
        },
        {
            label: "Fuel Type",
            children: listing.fuelType,
        },
        {
            label: "Engine",
            children: listing.engine,
        },
        {
            label: "Capacity",
            children: listing.capacity,
        },
        {
            label: "Drivetrain",
            children: listing.drivetrain,
        },
        {
            label: "Horsepower",
            children: listing.horsepower ? `${formatNumber(listing.horsepower)} hp` : undefined,
        },
        {
            label: "Torque",
            children: listing.torque ? `${formatNumber(listing.torque)} Nm` : undefined,
        },
        {
            label: "Condition",
            children: listing.condition,
        },
        {
            label: "Title Status",
            children: listing.titleStatus,
        },
        {
            label: "Previous Owners",
            children: formatNumber(listing.owners),
        },
        {
            label: "VIN",
            children: listing.vin,
        },
        {
            label: "Imported",
            children: formatBoolean(listing.imported),
        },
        {
            label: "Warranty",
            children: formatBoolean(listing.warranty),
        },
        {
            label: "Verified",
            children: formatBoolean(listing.verified),
        },
        {
            label: "Featured",
            children: formatBoolean(listing.featured),
        },
        {
            label: "Exterior Color",
            children: listing.color,
        },
        {
            label: "Interior",
            children: listing.interior,
        },
        {
            label: "Interior Color",
            children: listing.interiorColor,
        },
        {
            label: "Doors",
            children: formatNumber(listing.doors),
        },
        {
            label: "Seats",
            children: formatNumber(listing.seats),
        },
        {
            label: "Views",
            children: formatNumber(listing.views),
        },
        {
            label: "Leads",
            children: formatNumber(listing.leadCount),
        },
        {
            label: "Watch Count",
            children: formatNumber(listing.watchCount),
        },
        {
            label: "Favorites",
            children: formatNumber(listing.favorites),
        },
    ].filter((item) => item?.children !== undefined && item.children !== null && item.children !== "");

    return (
        <div className="rounded-2xl border bg-light-accent glass-card p-4 dark:bg-dark sm:p-5 md:p-7">
            <Descriptions
                title="Vehicle Details"
                layout="vertical"
                column={{xs: 2, sm: 2, md: 3}}
                size="small"
                items={items}
            />
        </div>
    );
}
