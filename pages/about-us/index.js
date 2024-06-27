import { GET_SHOP } from "@/apollo";
import CustomNavbar from "@/components/CustomNavbar";
import LoadingComponent from "@/components/LoadingComponent";
import FooterComponent from "@/components/salePage/FooterComponent";
import { CORLOR_APP, S3_URL, image_main } from "@/helper";
import { useLazyQuery } from "@apollo/client";
import { OrganizationChart } from "primereact/organizationchart";
import React, { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "react-bootstrap"

export default function index() {
  const [shopId, setShopId] = useState()
  const [shopData, setShopData] = useState();

  const [getShopData, { data: loadShopData, loading: loadingShop }] = useLazyQuery(GET_SHOP)

  console.log({ loadShopData })

  useEffect(() => {
    if (loadShopData) {
      setShopData(loadShopData?.shop)
    }
  }, [loadShopData])

  useEffect(() => {
    let _shop = JSON.parse(localStorage.getItem("PATCH_KEY"));
    if (_shop) {
      console.log({_shop})
      setShopId(_shop?.id)
    }
  }, [])


  useEffect(() => {
    getShopData({
      variables: {
        where: {
          id: shopId
        }
      }
    })
  }, [shopId])

  const openWhatsApp = (data) => {
    // console.log("log phone:--->", data)
    const phoneNumber = "+856020" + data;

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


  return (
    <>
      <CustomNavbar />
{loadingShop ? (
  <div className="card-about-us">
    <LoadingComponent />
  </div>
):(
      <div className="card-about-us">
        <img src={S3_URL + shopData?.image} style={{width:180,height:180, borderRadius:'50em',outline:'3px solid white'}} />
        <h1 style={{ marginTop: '.5em' }}>{shopData?.name}</h1>
        <Button style={{background:CORLOR_APP, border:'none'}} onClick={() => openWhatsApp(shopData?.phone)}>
                <FaWhatsapp style={{ fontSize: 18 }} /> +856 20{" "}
                {shopData?.phone}
              </Button>
      </div>
)}
      <FooterComponent />
    </>
  );
}
