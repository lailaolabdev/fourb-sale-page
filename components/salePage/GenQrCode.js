import React, { useEffect } from "react";
import QRCode from "qrcode.react";
import { useSubscription } from "@apollo/client"; 
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { removeCartItem } from "../../redux/salepage/cartReducer";
import { ON_ORDER_UPDATE } from "../../apollo/payment/mutation";

export default function GenQrCode({ qrcodeData, getOrderId,affiliateId, shopId, dataCompleted }) {
  const dispatch = useDispatch();
const navigate = useRouter()

  const { data: orderSubscription } = useSubscription(ON_ORDER_UPDATE, {
    variables: {
      orderId: getOrderId,
    },
  });

  // console.log("getOrderId9999999999====>", getOrderId);
  // console.log("orderSubscription====>", orderSubscription);
  useEffect(() => {
    if (orderSubscription) {
      // console.log("orderSubscription55====>", orderSubscription);
      if (orderSubscription?.onOrderUpdated?.id === getOrderId) {
        // console.log("successfully");
       
        dispatch(removeCartItem());
        navigate.push("/completedOrder");
       
      }
    }
  }, [JSON.stringify(orderSubscription)]);

  return (
    <>
      <QRCode value={qrcodeData} style={{ width: "100%", height: "100%" }} />
    </>
  );
}
