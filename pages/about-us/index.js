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
import { contactWhatsAppWitdhShop } from "@/const";

export default function index() {
  const [shopId, setShopId] = useState()
  const [shopData, setShopData] = useState();

  const [getShopData, { data: loadShopData, loading: loadingShop }] = useLazyQuery(GET_SHOP)


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
        <p style={{fontSize:14}}>ບ {shopData?.address?.village}, ມ {shopData?.address?.district}, {shopData?.address?.province}</p>
        <Button style={{background:CORLOR_APP, border:'none'}} onClick={() => contactWhatsAppWitdhShop(shopData?.phone)}>
                <FaWhatsapp style={{ fontSize: 18 }} /> +856 20{" "}
                {shopData?.phone}
              </Button>
      </div>
)}
      <FooterComponent />
    </>
  );
}
