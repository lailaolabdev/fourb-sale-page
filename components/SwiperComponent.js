import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import { GET_ADVERTISINGS } from "@/apollo/setting/query";
import { useLazyQuery } from "@apollo/client";
import { S3_URL, S3_URL_LARGE } from "@/helper";
import useWindowDimensions from "@/helper/useWindowDimensions";
import { FaWhatsapp } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { RiUserAddLine } from "react-icons/ri";

export default function SwiperComponent({ shopDetail }) {
  const [products, setProducts] = useState([]);
  const shopId = shopDetail?.id;

  const { height, width } = useWindowDimensions();
  console.log({ shopDetail });

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
      <div className="surface-border p-2 text-center w-100  ">
        <div className="mb-3 w-100 ">
          <img
            src={S3_URL + product.image}
            alt={product.name}
            className="w-100 shadow-2"
            style={{
              borderRadius: 3,
              maxHeight: width > 700 ? 380 : 280,
              minHeight: width > 700 ? 190 : 180,
            }}
          />
        </div>
        <div>
          <p style={{ fontSize: width > 700 ? "2em" : 20 }}>
            <b>{product.name}</b>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className={
        width > 900
          ? "d-flex gap-2 p-2 container-carousel"
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
        {shopDetail?.image ? (
          <img src={S3_URL + shopDetail?.image} />
        ) : (
          <img src="https://i.pinimg.com/originals/44/b1/4a/44b14a8b2fc649b18b3671f878af65c9.png" />
        )}
        <br />
        <h4>{shopDetail?.name}</h4>
        <br />
        {/* <small>ສອບຖາມຂໍ້ມູນເພິ່ມເຕີມຫາຮ້ານໄດ້ທີເບີວ໋ອດແອບ</small> */}
        <div className="shop-info">
          <div>
            <li>
              <RiUserAddLine />
              <span>Products: </span>
              <span>120 </span>
            </li>
            <li>
              <RiUserAddLine />
              <span>Following: </span>
              <span>540 </span>
            </li>
          </div>
          <div>
            <li>
              <RiUserAddLine />
              <span>Followers: </span>
              <span> 3.01k</span>
            </li>
            <li>
              <RiUserAddLine />
              <span>Followers: </span>
              <span>80</span>
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
