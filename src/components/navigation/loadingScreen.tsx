

import {Progress, Typography} from "antd";

const {Text, Title} = Typography;

export interface TaskProgressState {
    progress: number;
    step: string;
    detail?: string;
}

export default function LoadingScreen() {
    return <div className={'h-screen w-full flex items-center justify-center'}>
        <div className={"loader"}/>
    </div>
}

export function TaskLoadingOverlay({
    title,
    progress,
    step,
    detail
}: {
    title: string;
    progress: number;
    step: string;
    detail?: string;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm">
            <div className="w-[92%] max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-dark">
                <div className="mb-3 flex items-center gap-3">
                    <div className="loader"/>
                    <div>
                        <Title level={5} className="mb-0!">{title}</Title>
                        <Text type="secondary">{step}</Text>
                    </div>
                </div>
                <Progress percent={Math.max(0, Math.min(100, Math.round(progress)))} status="active"/>
                {detail ? <Text type="secondary">{detail}</Text> : null}
            </div>
        </div>
    );
}
