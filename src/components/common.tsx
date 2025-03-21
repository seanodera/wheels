import {ReactNode} from "react";
import {Link} from "react-router-dom";
import {CarAuction} from "@/types.ts";


export function CustomButton({className = "", children, to = '#'}: {
    className?: string;
    children: ReactNode,
    to?: string
}) {
    return (
        <Link to={to}>
            <button
                className={`px-6 py-3 text-xl font-semibold rounded-lg transition ${className}`}
            >
                {children}
            </button>
        </Link>
    );
}

export function HighlightBackground({className = "", children}: { className?: string; children: ReactNode }) {
    return (
        <span
            className={`px-2 py-1 rounded-lg border-primary border-solid border-s-4 border-b-4 border-e-2 border-t-2 ${className}`}
        >
      {children}
    </span>
    );
}

export function isCarAuction (item: any): item is CarAuction {
    return "ending" in item
};

