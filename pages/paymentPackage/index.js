import { useMutation } from "@apollo/client";
import {  GEN_QR_AND_SUBSCRIPE_FOR_PAYMENT_ADD_PACKAGE } from "../../apollo/payment/mutation";
import { S3_URL } from "../../helper";
import { Button, QRCode } from "antd";
import React from "react";
import { useSelector } from "react-redux";

export default function subnups() {
  const transactionId = useSelector((state) => state?.qrcode);

  const [createQrPayment, { loading: loadingSubscripe }] = useMutation(
    GEN_QR_AND_SUBSCRIPE_FOR_PAYMENT_ADD_PACKAGE
  );

  console.log('transactionId--->', transactionId?.setqr);

  const handleConfirmBcel = async () => {


    const genqrCode = await createQrPayment({
      variables: {
        data: {
          order: transactionId?.setqr,
        },
      },
    });
    console.log({ genqrCode });
    // Check if a QR code was generated successfully
    const qrCodeValue =
      genqrCode?.data?.createQrAndSubscripeForPayment?.qrCode;

    if (qrCodeValue) {
      // Set the QR code data
      console.log("onepay qrcode: " + qrCodeValue)

      // Create an anchor element
      const onPayLink = document.createElement("a");
      onPayLink.href = "onepay://qr/" + qrCodeValue;
      // Check if it's an iOS device
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        // For iOS, use window.location.href to open the app
        window.location.href = onPayLink.href;
      } else {
        // For non-iOS devices, programmatically trigger a click event
        const event = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        onPayLink.dispatchEvent(event);
      } 
    }

  };

  return (
    <div className="card-qr-package">
      <p>ຊຳລະເພື່ອຊື້ລະບົບ 4B ໂຟບີ ເພື່ອທຸລະກິດຂອງທ່ານ</p>
      <div>
        <QRCode
          // errorLevel="H"
          value={transactionId?.setqr}
          // icon="/assets/images/mainLogo.png"
          // icon={S3_URL + 'b0c2bbde-fbdd-4d1a-9a4c-e6d6f1a24f51.png'}
        />
        <Button onClick={handleConfirmBcel}>BCEL</Button>
      </div>
    </div>
  );
}
