import { ReactNode, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Carousel, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {useMediaQuery} from "react-responsive";

const { Title, Text } = Typography;

export default function CustomCarousel({
                                           className,
                                           items = 1,
                                           title,
                                           description,
                                           to,
                                           children,
                                           autoPlay = false,
                                       }: {
    className?: string;
    items?: number;
    title?: string;
    description?: string;
    to?: string;
    children?: ReactNode;
    autoPlay?: boolean;
}) {
    const carouselRef = useRef<any | null>(null);
    const [slidesToShow, setSlidesToShow] = useState(items);

    // Define breakpoints
    const isMobile = useMediaQuery({ maxWidth: 639 });
    const isTablet = useMediaQuery({ minWidth: 640, maxWidth: 1023 });
    const isSmallDesktop = useMediaQuery({ minWidth: 1024, maxWidth: 1279 });

    // Update slides based on breakpoints and item count
    useEffect(() => {
        let newSlidesToShow = items; // Default to number of items

        if (isMobile) newSlidesToShow = Math.min(1, items);
        else if (isTablet) newSlidesToShow = Math.min(2, items);
        else if (isSmallDesktop) newSlidesToShow = Math.min(3, items);

        setSlidesToShow(newSlidesToShow);
    }, [isMobile, isTablet, isSmallDesktop, items]);

    const handlePrev = () => carouselRef.current?.prev();
    const handleNext = () => carouselRef.current?.next();

    return (
        <div className={` ${className}`}>
            <div className="flex justify-between items-center mb-2">
                <div>
                    {title ? <Title level={3} className="text-current mb-0">{title}</Title> : <div />}
                    {description ? <Text className="text-current">{description}</Text> : <div />}
                </div>
                {to ? <Link to={to}><Button type="primary" ghost>View All</Button></Link> : <div />}
            </div>
            <Carousel
                ref={carouselRef}
                className="!gap-4"
                slidesToShow={slidesToShow}
                slidesToScroll={slidesToShow}
                autoplay={autoPlay}
                infinite
                swipe
            >
                {children}
            </Carousel>
            <div className="flex justify-end items-center gap-4">
                <Button shape="circle" icon={<LeftOutlined />} onClick={handlePrev} />
                <Button shape="circle" icon={<RightOutlined />} onClick={handleNext} />
            </div>
        </div>
    );
}
