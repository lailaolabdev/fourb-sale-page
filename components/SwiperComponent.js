import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { GET_ADVERTISINGS } from "@/apollo/setting/query";
import { useLazyQuery } from "@apollo/client";
import { COLOR_TEXT, CORLOR_APP, EMPTY_USER_PROFILE, S3_URL, S3_URL_LARGE, S3_URL_MEDIUM } from "@/helper";
import useWindowDimensions from "@/helper/useWindowDimensions";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaPlus,
  FaSitemap,
  FaWhatsapp,
} from "react-icons/fa";
import { FaHeartCircleCheck, FaShop } from "react-icons/fa6";
import { RiUserAddLine } from "react-icons/ri";
import { Button } from "primereact/button";
import { SlUserFollowing } from "react-icons/sl";
import { TbEyeShare } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import 'react-slideshow-image/dist/styles.css'
import { Slide, Fade, Zoom } from 'react-slideshow-image';
import { GrNext, GrPrevious } from "react-icons/gr";


const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // backgroundSize: 'contain',
  height: '100%',
  width: '100%'
}

export default function SwiperComponent({ shopDetail, contactshop, productTotal }) {
  const [products, setProducts] = useState([]);
  const shopId = shopDetail?.id;
  const [follower, setFolloWer] = useState(false);

  const { height, width } = useWindowDimensions();

  const [
    getAdvertisings,
    { data: advertisings, loading: loadingAdvertisings },
  ] = useLazyQuery(GET_ADVERTISINGS, {
    fetchPolicy: "cache-and-network",
  });

  const fetchAdvertisingData = async () => {
    getAdvertisings({
      variables: {
        where: {
          shop: shopId,
          status: false,
        },
      },
    });
  };

  useEffect(() => {
    fetchAdvertisingData();
  }, [shopId]);

  useEffect(() => {
    if (!advertisings) return;
  }, [advertisings]);

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";
      case "LOWSTOCK":
        return "warning";
      case "OUTOFSTOCK":
        return "danger";
      default:
        return null;
    }
  };

  useEffect(() => {
    if (advertisings?.advertisements?.data) {
      setProducts(advertisings.advertisements.data.slice(0, 9));
    }
  }, [advertisings]);

  const openWhatsApp = () => {
    const phoneNumber = "+856020" + shopDetail?.phone;

    // You can also include a message using the 'text' parameter.
    const message = "ສະບາຍດີ🙏";

    // Construct the WhatsApp URL using https://wa.me.
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp using the constructed URL.
    // window.open(whatsappUrl);
    window.location.href = whatsappUrl;
  };
  const buttonStyle = {
    width: 30,
    height: 30,
    background: 'none',
    border: '0px',
    background: '#ffffff93',
    borderRadius: 3,
    outline: 'none',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  };


  const productTemplate = (product) => {
    return (
      <div className="surface-border text-center w-100 ">
        <div style={{ width: "100%", height: width > 800 ? "25vw" : "38vw" }}>
          <img
            src={S3_URL_MEDIUM + product.image}
            alt={product.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
    >
      <Carousel
        value={products}
        numVisible={1}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        // className="custom-carousel"
        // circular
        autoplayInterval={3000}
        itemTemplate={productTemplate}
        showIndicators={false}
        showNavigators={false}
      />
 
    </div>
  );
}
