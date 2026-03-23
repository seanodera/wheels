import {CarAuction, CarItem} from "@/types";
import {keysToCamelCase} from "@/utils/caseConverter.ts";


export const toCarItem = (value: unknown): CarItem => {
    const cleaned = keysToCamelCase<any>(value);
    // console.log(cleaned, cleaned.vehicle)
    return {
        ...cleaned,
        ...cleaned.vehicle
    }
};
export const toCarAuction = (value: unknown): CarAuction => {
    const cleaned = keysToCamelCase<any>(value);
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

export function isCarAuction(item: any): item is CarAuction {
    return item.type === 'auction';
}