import {supabase} from "@/utils/supabase.ts";

type TrackVehicleViewArgs = {
    vehicleId: string;
    dealerId: string;
    userId?: string | null;
};

export const trackVehicleView = async ({vehicleId, dealerId, userId}: TrackVehicleViewArgs): Promise<number | null> => {
    try {
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

        for (let attempt = 0; attempt < 3; attempt += 1) {
            const {data: vehicle, error: vehicleFetchError} = await supabase
                .from("vehicles")
                .select("views")
                .eq("id", vehicleId)
                .maybeSingle();

            if (vehicleFetchError) {
                console.error("Failed to fetch vehicle views", vehicleFetchError);
                return null;
            }

            const currentViews = Number(vehicle?.views ?? 0);
            const nextViews = currentViews + 1;

            const {data: updatedVehicles, error: vehicleUpdateError} = await supabase
                .from("vehicles")
                .update({views: nextViews})
                .eq("id", vehicleId)
                .eq("views", currentViews)
                .select("views")
                .returns<{views: number}[]>();

            if (vehicleUpdateError) {
                console.error("Failed to update vehicle views", vehicleUpdateError);
                return null;
            }

            const updatedVehicle = updatedVehicles?.[0];
            if (updatedVehicle) {
                return Number(updatedVehicle.views ?? nextViews);
            }
        }

        const {data: latestVehicle, error: latestVehicleError} = await supabase
            .from("vehicles")
            .select("views")
            .eq("id", vehicleId)
            .maybeSingle();

        if (latestVehicleError) {
            console.error("Failed to read latest vehicle views", latestVehicleError);
            return null;
        }

        return Number(latestVehicle?.views ?? 0);
    } catch (error) {
        console.error("Failed to track vehicle view", error);
        return null;
    }
};
