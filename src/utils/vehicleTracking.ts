import {supabase} from "@/utils/supabase.ts";

type TrackVehicleViewArgs = {
    vehicleId: string;
    dealerId: string;
    userId?: string | null;
    posthogDistinctId?: string | null;
    eventName: string;
    eventProperties: Record<string, unknown>;
    capture?: (eventName: string, properties: Record<string, unknown>) => void;
};

type RecordVehicleViewResult = {
    inserted?: boolean;
    views?: number;
};

export const trackVehicleView = async ({
    vehicleId,
    dealerId,
    userId,
    posthogDistinctId,
    eventName,
    eventProperties,
    capture
}: TrackVehicleViewArgs): Promise<number | null> => {
    try {
        console.log("[trackVehicleView] start", {
            vehicleId,
            dealerId,
            userId,
            posthogDistinctId,
            eventName,
            eventProperties
        });

        const {data, error} = await supabase.rpc("record_vehicle_view", {
            p_vehicle_id: vehicleId,
            p_dealer_id: dealerId,
            p_user_id: userId,
            p_posthog_distinct_id: posthogDistinctId,
            p_metadata: eventProperties
        });

        console.log("[trackVehicleView] rpc response", {data, error});

        if (error) {
            console.error("Failed to record vehicle view", error);
            return null;
        }

        const result = data as RecordVehicleViewResult | null;

        if (result?.inserted) {
            console.log("[trackVehicleView] unique view inserted, capturing PostHog event", {
                eventName,
                views: result.views
            });

            capture?.(eventName, {
                ...eventProperties,
                posthog_distinct_id: posthogDistinctId,
                unique_view: true
            });
        } else {
            console.log("[trackVehicleView] duplicate view ignored; Supabase returned current unique view count", {
                vehicleId,
                userId,
                posthogDistinctId,
                views: result?.views
            });
        }

        const views = typeof result?.views === "number" ? result.views : null;
        console.log("[trackVehicleView] complete", {views});
        return views;
    } catch (error) {
        console.error("Failed to track vehicle view", error);
        return null;
    }
};
