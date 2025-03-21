import {Dealer} from "@/types.ts";
import {Button, Typography} from "antd";
import {MoreOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

const {Title, Text} = Typography;
export function DealerItem({dealer, className = '', square}: {dealer: Dealer, className?: string, square?: boolean}) {

    return (<Link to={`/dealers/${dealer.id}`} className={`block w-full ${className}`}>
        <div className={'bg-dark-400/40 flex justify-between rounded-t-md p-4'}>
            <div>
                <Title className={'leading-none !my-0'} level={5}>{dealer.name}</Title>
                <Text className={'leading-none !my-0'}>{dealer.location.district}, {dealer.location.city}</Text>
            </div>
            <Button type={'text'} icon={<MoreOutlined/>} shape={'circle'}/>
        </div>
        <img src={dealer.images[0]} className={`${square? 'aspect-square' : 'aspect-video'} w-full rounded-b-lg object-cover`} alt={''}/>
    </Link>)
}
