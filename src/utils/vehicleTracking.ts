import {supabase} from "@/utils/supabase.ts";

type TrackVehicleViewArgs = {
    vehicleId: string;
    dealerId: string;
    userId?: string | null;
};

export const trackVehicleView = async ({vehicleId, dealerId, userId}: TrackVehicleViewArgs): Promise<number | null> => {
    try {
        const {data: vehicle, error: vehicleFetchError} = await supabase
            .from("vehicles")
            .select("views")
            .eq("id", vehicleId)
            .maybeSingle();

        if (vehicleFetchError) {
            console.error("Failed to fetch vehicle views", vehicleFetchError);
            return null;
        }

        const nextViews = Number(vehicle?.views ?? 0) + 1;

        const {error: vehicleUpdateError} = await supabase
            .from("vehicles")
            .update({views: nextViews})
            .eq("id", vehicleId);

        if (vehicleUpdateError) {
            console.error("Failed to update vehicle views", vehicleUpdateError);
            return null;
        }

        const payload: {
            vehicle_id: string;
            dealer_id: string;
            event_type: "view";
            user_id?: string;
        } = {
            vehicle_id: vehicleId,
            dealer_id: dealerId,
            event_type: "view"
        };

        if (userId) {
            payload.user_id = userId;
        }

        const {error: eventInsertError} = await supabase
            .from("vehicle_events")
            .insert(payload);

        if (eventInsertError) {
            console.error("Failed to insert vehicle view event", eventInsertError);
        }

        return nextViews;
    } catch (error) {
        console.error("Failed to track vehicle view", error);
        return null;
    }
};

