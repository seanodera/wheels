
import {Link} from "react-router-dom";
import {toMoneyFormat} from "@/utils.ts";
import {Typography} from "antd";
import {CarItem} from "@/types.ts";

const {Title, Text } = Typography;
export default function ListingComponent({listing}: { listing: CarItem }) {

    return (
        <Link to={`/listing/${listing.id}`} className={'block text-current'}>
            <div className="aspect-video relative">
                <img src={listing.images[0] || "/placeholder.jpg"} alt="" className="w-full h-full object-cover rounded-lg" />
                <div className="absolute bottom-1 left-1 bg-dark flex gap-2 px-2 py-1 rounded-md">
                    <span>
                        <Text className="leading-none my-0 font-medium"> KSH {toMoneyFormat(listing.price, true)}</Text>
                    </span>
                </div>
            </div>
            <div>
                <Title className={'leading-none'} level={5}>{listing.year} {listing.brand} {listing.model}</Title>
                <Text className={'leading-none block'} >{listing.millage} KM · {listing.engine} · {listing.transmission} . {listing.drivetrain}</Text>
                <Text className={'leading-none block'} type={'secondary'}>{listing.tags.join(', ')}</Text>
            </div>
        </Link>
    );
}
