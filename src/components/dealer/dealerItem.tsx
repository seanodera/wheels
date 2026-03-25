import type {Dealership} from "@/types";
import {Button, Typography} from "antd";
import {MoreOutlined} from "@ant-design/icons";
import {Link} from "react-router";

const {Title, Text} = Typography;
export function DealerItem({dealer, className = '', square}: {dealer: Dealership, className?: string, square?: boolean}) {
    const primaryLocation = dealer.locations?.[0];
    const place = [primaryLocation?.subCounty, primaryLocation?.county].filter(Boolean).join(", ");

    return (<Link to={`/dealers/${dealer.id}`} className={`block w-full ${className}`}>
        <div className={'bg-dark-400/40 flex justify-between rounded-t-md p-4'}>
            <div>
                <Title className={'leading-none my-0!'} level={5}>{dealer.name}</Title>
                <Text className={'leading-none my-0!'}>{place}</Text>
            </div>
            <Button type={'text'} icon={<MoreOutlined/>} shape={'circle'}/>
        </div>
        <img src={dealer.images[0]} className={`${square? 'aspect-square' : 'aspect-video'} w-full rounded-b-lg object-cover`} alt={''}/>
    </Link>)
}
