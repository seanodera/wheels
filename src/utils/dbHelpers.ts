import {CarAuction, CarItem} from "@/types";
import {keysToCamelCase} from "@/utils/caseConverter.ts";

type VehiclePayload<T> = T & {
    vehicle?: Partial<T>;
};

export const toCarItem = (value: unknown): CarItem => {
    const cleaned = keysToCamelCase<VehiclePayload<CarItem>>(value);
    // console.log(cleaned, cleaned.vehicle)
    return {
        ...cleaned,
        ...cleaned.vehicle
    }
};
export const toCarAuction = (value: unknown): CarAuction => {
    const cleaned = keysToCamelCase<VehiclePayload<CarAuction>>(value);
    // console.log(cleaned)
    return {
        ...cleaned,
        ...cleaned.vehicle
    }
};

export const toNumber = (value: unknown, fallback = 0): number => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

export function isCarAuction(item: unknown): item is CarAuction {
    if (!item) return false;
    return Boolean(item) && typeof item === "object" && "type" in item && item.type === "auction";
}

export function normalizeError(error: unknown, fallback: string) {
    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error) {
        return String((error as {message?: unknown}).message ?? fallback);
    }
    return fallback;
}