import LogoComponent from "@/assets/logoComponent.tsx";

function LoadingMark({size = "md"}: {size?: "sm" | "md"}) {
    const wrapperClass = size === "sm" ? "w-12!" : "w-16!";
    const logoClass = size === "sm" ? "w-10!" : "w-14!";

    return (
        <div className={`loader ${wrapperClass} bg-transparent!`}>
            <LogoComponent className={`${logoClass} mx-auto animate-spin text-primary dark:text-accent`}/>
        </div>
    );
}


export default function LoadingScreen() {
    return <div className="flex h-screen w-full items-center justify-center">
        <LoadingMark/>
    </div>;
}

