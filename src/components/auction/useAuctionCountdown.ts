import {useEffect, useState} from "react";
import {deduceTimingValues} from "@/utils";


export function useAuctionCountdown(ending: string | Date) {
    const [countDown, setCountDown] = useState("");
    const [hasEnded, setHasEnded] = useState(false);

    useEffect(() => {
        const update = () => {
            const { diff, days, hours, minutes } = deduceTimingValues(new Date(ending));

            if (diff <= 0) {
                setCountDown("Ended");
                setHasEnded(true);
                return;
            }

            setHasEnded(false);

            if (days > 0) return setCountDown(`${days} day${days > 1 ? "s" : ""}`);
            if (hours > 0) return setCountDown(`${hours} hour${hours > 1 ? "s" : ""}`);
            setCountDown(`${minutes} min${minutes > 1 ? "s" : ""}`);
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [ending]);

    return { countDown, hasEnded };
}