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

  const productTemplate = (product) => {
    return (
      <div className="surface-border p-2 text-center w-100 ">
        <div style={{width:"100%",height: width >800 ? 360: 185}}>
          <img
            src={S3_URL_MEDIUM + product.image}
            alt={product.name}
            style={{
              borderRadius: 3,
              width:'100%', height:'100%',
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
        // showNavigators={false}
      />
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
            {/* {width > 800 && <small>
              <FaMapMarkerAlt
                style={{ color: "red", fontSize: 18, paddingBottom: 5 }}
              />{" "}
              ທີ່ຢູ່: ບ. {shopDetail?.address?.village}, ມ.{" "}
              {shopDetail?.address?.district}, ຂ.{" "}
              {shopDetail?.address?.province}
            </small>} */}
          </div>
        </div>

        {/* <div className="d-flex gap-3">
          <Button
            severity="success"
            onClick={()=>contactshop(shopDetail?.phone)}
            style={{
              borderRadius: 3,
              fontSize: 14,
              height: 40,
              marginTop: 8,
              background: "green",
              border: "none",
            }}
          >
            <FaWhatsapp style={{ fontSize: 21, marginRight: 15 }} /> +856 20{" "}
            {shopDetail?.phone}
          </Button>
          {follower ? (
            <Button
              onClick={() => setFolloWer(false)}
              severity="secondary"
              style={{
                borderRadius: 3,
                fontSize: 14,
                height: 40,
                marginTop: 8,
                background:CORLOR_APP,
                border: `1px solid ${COLOR_TEXT}`,
              }}
            >
              <SlUserFollowing style={{ fontSize: 20, marginRight: 15 }} />{" "}
              ຕິດຕາມແລ້ວ
            </Button>
          ) : (
            <Button
              onClick={() => setFolloWer(true)}
              severity="secondary"
              outlined
              style={{
                borderRadius: 3,
                fontSize: 14,
                height: 40,
                marginTop: 8,
                border: `1px solid ${COLOR_TEXT}`,
              }}
            >
              <SlUserFollowing style={{ fontSize: 20, marginRight: 15 }} />{" "}
              ຕິດຕາມ
            </Button>
          )}
        </div> */}
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
        {/* <p>
          ທີ່ຢູ່: ບ້ານ {shopDetail?.address?.village}., ເມືອງ{" "}
          {shopDetail?.address?.district}, ແຂວງ {shopDetail?.address?.province}
        </p> */}
        {/* <button onClick={openWhatsApp} className="btn-calling-shop">
          <FaWhatsapp style={{ fontSize: 30 }} />
          <span>+856 020 {shopDetail?.phone}</span>
        </button> */}
      </div>
    </div>
  );
}
