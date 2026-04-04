import {Typography} from "antd";
import {BaseCar} from "@/types";
import {startCase} from "lodash";

const {Title, Paragraph} = Typography

export function VehicleDescription({listing}: { listing: BaseCar }) {
    const {description} = listing;

    return (
        <div className="rounded-2xl border bg-light-accent glass-card dark:bg-dark p-5 md:p-7">
            <Title level={4} className="mb-6! ">
                Description
            </Title>
            <div className="space-y-8">
                {Object.entries(description).map(([key, value]) =>
                    value ? (
                        <div key={key}>
                            <Title level={4}>{startCase(key)}</Title>
                            <Paragraph>{String(value)}</Paragraph>
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}