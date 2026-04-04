import {useMemo} from "react";
import {theme} from "antd";
import type {ConfigProviderProps} from "antd";

export default function useGlassTheme(currentTheme: "light" | "dark"): ConfigProviderProps["theme"] {
    const {darkAlgorithm, defaultAlgorithm} = theme;

    return useMemo(() => ({
        token: {
            colorPrimary: "#00e5ff",
            colorInfo: "#00e5ff",
            colorLink: "#00e5ff",
            borderRadius: 12,
            borderRadiusLG: 12,
            borderRadiusSM: 12,
            borderRadiusXS: 12,
            wireframe: false,
            motionDurationSlow: "0.2s",
            motionDurationMid: "0.1s",
            motionDurationFast: "0.05s",
            ...(currentTheme === "dark" ? {colorBgBase: "#000506"} : {}),
        },
        algorithm: currentTheme === "light" ? defaultAlgorithm : darkAlgorithm,
        components: {
            Button: {
                colorPrimary: currentTheme === "light" ? "#001315" : undefined,
            },
            Card: {
                lineType: "",
            },
            Layout: {
                headerBg: currentTheme === "light" ? "#FFFFFF" : "#040100",
            },
        },
    }), [currentTheme, darkAlgorithm, defaultAlgorithm]);
}
