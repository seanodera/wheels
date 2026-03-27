import Cookies from "js-cookie";

export * from './caseConverter.ts'
export * from './supabase.ts'
export * from './dbHelpers.ts'
export * from './vehicleTracking.ts'
export * from './profileQueries.ts'

export function toMoneyFormat(amount: number, shorten: boolean = false): string {
    if (shorten) {
        if (amount >= 1_000_000) {
            return (amount / 1_000_000).toFixed(2) + "M";
        } else if (amount >= 1_000) {
            return (amount / 1_000).toFixed(2) + "K";
        }
    }

    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export function deduceTimingValues(value: Date) {

    const now = new Date().getTime();
    const endTime = new Date(value).getTime();
    const diff = endTime - now;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {days: days, hours: hours, minutes: minutes, diff: diff};
}

export function saveAuthentication(at: string, rt: string, exp?: number){
    Cookies.set('wheeler_at', at, {
        expires: exp
    });
    Cookies.set('wheeler_rt', rt,{
        expires: exp
    });
}

export function getAuthentication(){
   const at = Cookies.get('wheeler_at');
   const rt = Cookies.get('wheeler_rt');

   return {
       access_token: at,
       refresh_token: rt
   }
}

export function clearAuthentication(){
    Cookies.remove('wheeler_at');
    Cookies.remove('wheeler_rt');
}


export const vehiclesTableColumns = [
    {
        "column_name": "id"
    },
    {
        "column_name": "seller_id"
    },
    {
        "column_name": "name"
    },
    {
        "column_name": "year"
    },
    {
        "column_name": "brand"
    },
    {
        "column_name": "model"
    },
    {
        "column_name": "mileage"
    },
    {
        "column_name": "transmission"
    },
    {
        "column_name": "fuel_type"
    },
    {
        "column_name": "engine"
    },
    {
        "column_name": "capacity"
    },
    {
        "column_name": "drivetrain"
    },
    {
        "column_name": "body"
    },
    {
        "column_name": "vin"
    },
    {
        "column_name": "title_status"
    },
    {
        "column_name": "color"
    },
    {
        "column_name": "interior"
    },
    {
        "column_name": "images"
    },
    {
        "column_name": "video"
    },
    {
        "column_name": "tags"
    },
    {
        "column_name": "description"
    },
    {
        "column_name": "comments"
    },
    {
        "column_name": "created_at"
    },
    {
        "column_name": "updated_at"
    },
    {
        "column_name": "condition"
    },
    {
        "column_name": "owners"
    },
    {
        "column_name": "interior_color"
    },
    {
        "column_name": "doors"
    },
    {
        "column_name": "seats"
    },
    {
        "column_name": "horsepower"
    },
    {
        "column_name": "torque"
    },
    {
        "column_name": "imported"
    },
    {
        "column_name": "warranty"
    },
    {
        "column_name": "verified"
    },
    {
        "column_name": "featured"
    },
    {
        "column_name": "favorites"
    },
    {
        "column_name": "active"
    },
    {
        "column_name": "type"
    },
    {
        "column_name": "views"
    }
].map((v) => v.column_name)
