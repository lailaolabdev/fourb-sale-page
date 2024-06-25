import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { GET_ADVERTISINGS } from "@/apollo/setting/query";
import { useLazyQuery } from "@apollo/client";
import { COLOR_TEXT, CORLOR_APP, S3_URL, S3_URL_LARGE, S3_URL_MEDIUM } from "@/helper";
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

  const properties = {
    prevArrow: <button style={{ ...buttonStyle }}><GrPrevious style={{ color: '#444' }} /></button>,
    nextArrow: <button style={{ ...buttonStyle }}><GrNext style={{ color: '#444' }} /></button>
  }


  const productTemplate = (product) => {
    return (
      <div className="surface-border p-2 text-center w-100 ">
        <div style={{ width: "100%", height: width > 800 ? 360 : 185 }}>
          <img
            src={S3_URL_MEDIUM + product.image}
            alt={product.name}
            style={{
              borderRadius: 3,
              width: '100%', height: '100%',
              // maxHeight: width > 700 ? 280 : 210,
              // minHeight: width > 700 ? 260 : 80,
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={
        width > 900
          ? "d-flex gap-2 p-4 container-carousel"
          : "d-flex flex-column gap-2 p-2 container-carousel"
      }
    >
      {/* <Carousel
        value={products}
        numVisible={1}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        // className="custom-carousel"
        // circular
        autoplayInterval={3000}
        itemTemplate={productTemplate}
        showIndicators={false}
        // showNavigators={false}
      /> */}

      <div className="slide-container">

        <Slide
          // arrows={true} 
          {...properties}
        >
          {products.map((slideImage, index) => (
            <div key={index} style={{ width: '100%', height: width > 700 ? 380 : 205 }}>
              <div style={{ ...divStyle }}>
                {/* <span className="title-slide-image">{slideImage?.name}</span> */}
                <img className="w-100 h-100" src={S3_URL_MEDIUM + slideImage.image} />
              </div>
            </div>
          ))}
        </Slide>
      </div>
      <div className="card-carousel-right">
        <div className="shop-profile">
          {shopDetail?.image ? (
            <img src={S3_URL + shopDetail?.image} />
          ) : (
            <img src="https://i.pinimg.com/originals/44/b1/4a/44b14a8b2fc649b18b3671f878af65c9.png" />
          )}
          <h4>{shopDetail?.name}</h4>

          <div className="btn-action-call">

            <div className="d-flex gap-2 w-100 justify-content-end align-items-end">
              <button onClick={() => contactshop(shopDetail?.phone)}>
                <FaWhatsapp style={{ fontSize: 18 }} /> +856 20{" "}
                {shopDetail?.phone}
              </button>
              <button onClick={() => setFolloWer(!follower)}>
                <FaPlus style={{ fontSize: 15 }} />{" "}
                {follower ? "ຕິດຕາມແລ້ວ" : "ຕິດຕາມ"}
              </button>
            </div>

          </div>
        </div>

        <br />
        <small>
          <FaMapMarkerAlt
            style={{ color: "red", fontSize: 18, paddingBottom: 5 }}
          />{" "}
          ທີ່ຢູ່: ບ. {shopDetail?.address?.village}, ມ.{" "}
          {shopDetail?.address?.district}, ຂ.{" "}
          {shopDetail?.address?.province}
        </small>

        <div className="shop-info">
          <div>
            <li>
              <FaSitemap style={{ fontSize: 18 }} />
              <span>ສິນຄ້າທັງໝົດ: </span>
              <span>{productTotal ?? 0}</span>
            </li>
            <li>
              <FaHeart style={{ fontSize: 18 }} />
              <span>ກົດໃຈ: </span>
              <span>5 </span>
            </li>
          </div>
          <div>
            <li>
              <RiUserAddLine style={{ fontSize: 22 }} />
              <span>ຜູ້ຕິດຕາມ: </span>
              <span>5</span>
            </li>
            <li>
              <TbEyeShare style={{ fontSize: 22 }} />
              <span>ການເຂົ້າຊົມ: </span>
              <span>150</span>
            </li>
          </div>
        </div>

      </div>
    </div>
  );
}
