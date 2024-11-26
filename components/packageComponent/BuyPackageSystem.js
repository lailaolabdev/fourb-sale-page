import { S3_URL } from "../../helper";
import { ADD_PACKAGE_SYSTEM } from "../../apollo/addpackage/mutation";
import { useMutation, useSubscription } from "@apollo/client";
import { Avatar, QRCode, Watermark } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { GEN_QR_AND_SUBSCRIPE_FOR_PAYMENT_ADD_PACKAGE, ON_SHOP_SUPSCIPTION } from "../../apollo/payment/mutation";
import Swal from "sweetalert2";

export default function BuyPackageSystem({ handleCancel, setObjectData, setGetShop, packageType, setStatusShop, previewData, transactionId }) {
  const [isDataShop, setIsDataShop] = useState(false);
  const [enableQr, setEnableQr] = useState(false);
  const [enableCompleted, setEnableCompleted] = useState(false);
  const [dataReponse, setDataResponse] = useState();
  const [getQrcode, setGetQrcode] = useState();

  const navigate = useRouter();
  const dispatch = useDispatch();


  const [createQrPayment, { loading: loadingSubscripe }] = useMutation(
    GEN_QR_AND_SUBSCRIPE_FOR_PAYMENT_ADD_PACKAGE
  );


  const handleInputNew = () => {
    setIsDataShop(false);
    setObjectData({
      username: "",
      password: "",
      typepackage: "",
    });
  };



  // go to open app bcel
  const handleNext = async () => {
    try {
      const genqrCode = await createQrPayment({
        variables: {
          data: {
            order: transactionId,
            typePackage: packageType,
          },
        },
      });
      const qrCodeValue =
        genqrCode?.data?.genQrAndSubscripeForPaymentAddPackage?.qrCode;

      if (qrCodeValue) {
        setGetQrcode(qrCodeValue);
        setEnableQr(true);
        const onPayLink = document.createElement("a");
        onPayLink.href = "onepay://qr/" + qrCodeValue;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

        if (isIOS) {
          window.location.href = onPayLink.href;
        } else {
          const event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          onPayLink.dispatchEvent(event);
        }
      }
    } catch (error) {
      console.log("error:", error);
    }
  };


  const handleCancelPayment = () => {
    setObjectData({
      username: "",
      password: "",
      typepackage: "",
    });
    handleCancel();
    setIsDataShop(false);
    setEnableQr(false);
    setGetQrcode("");
  };

  const handleLoginToLiveSystem = () => {
    window.open('https://shop.bbbb.com.la/')
    handleCancelPayment()
  }

  // ເປີດແອັບ bcel ຄືນອິກຄັ້ງ
  const handleOpenBcelNew = () => {

    const onPayLink = document.createElement("a");
    onPayLink.href = "onepay://qr/" + getQrcode;
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
  };

  // subscription -------------------->
  const { data: orderSubscription } = useSubscription(ON_SHOP_SUPSCIPTION, {
    variables: {
      shopId: transactionId,
    },
  });

  useEffect(() => {
    if (orderSubscription) {
      // console.log("orderSubscription55====>", orderSubscription);
      if (orderSubscription?.onShopUpdatedPackage?.transactionId === transactionId) {
        // console.log("Completed Paid Package......");
        setGetQrcode("");
        setStatusShop(false)
        setGetShop()
        setObjectData({
          username: "",
          password: ""
        })
      }
    }
  }, [JSON.stringify(orderSubscription)]);


  return (
    <>
      {!enableQr ? (
        <Form>


          <div className="card-check-confirm">

            <br />
            {/* <img src={S3_URL + previewData?.shopData?.shop?.image} style={{ maxWidth: 260 }} /> */}
            <Avatar size={80} style={{ border: '1px solid #f2f2f2' }} src={S3_URL + previewData?.shopData?.shop?.image} />
            <br />
            <div style={{ lineHeight: 1, marginTop: 10, textAlign: 'center' }}>
              {/* <p>ID SHOP: {previewData?.shopData?.shop?.id}</p> */}
              <h5><b>{previewData?.shopData?.shop?.name}</b></h5>
              <h5><b>{previewData?.shopData?.shop?.phone}</b></h5>
              {/* <h5>ລາຍລະອຽດ: <b>{previewData?.shopData?.note ?? "................."}</b></h5> */}
              {/* <p>ຊື່ນຳໃຊ້ລະບົບ: {previewData?.shopData?.phone}</p> */}
            </div>
            {/* <br />
              <p>
                <b>ໝາຍເຫດ:</b> ຖ້າຫາກວ່າທ່ານຊຳລະຄ່າລະບົບໄປແລ້ວ
                ຈະບໍ່ສາມາດຄືນເງິນໄດ້ໃນທຸກກໍລະນີ.
              </p> */}
            <p>ກະລຸນາກວດສອບ ຊື່ຮ້ານ ແລະ ເບີໂທ ອິກຄັ້ງ ເພື່ອຄວາມປອດໄພຂອງທ່ານ!</p>

          </div>


          <br />
          <div className="d-flex justify-content-center gap-2 mt-4 w-100">

            <button type="button" onClick={handleCancelPayment} className="btn-package-cancel">
              <span>ຍົກເລີກ</span>
            </button>

            <button type="button" onClick={handleNext} className="btn-package-confirm">
              {loadingSubscripe ? <Spinner size="sm" /> : "ຢືນຢັນຊື້ແພັກເກັດ"}
            </button>

          </div>
        </Form>
      ) : (
        <div className="card-qr-package">
          <p>{getQrcode && "ຊຳລະເງິນຜ່ານ bcel One"}</p>
          <div>
            {getQrcode ? (
              <QRCode
                // errorLevel="H"
                value={getQrcode}
                size={300}
              // icon="/assets/images/mainLogo.png"
              // icon={S3_URL + 'b0c2bbde-fbdd-4d1a-9a4c-e6d6f1a24f51.png'}
              />
            ) : (
              // <Watermark   gap={[10, 10]} content={['123454345','AD-SERDS']} >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Avatar size={100} src="/assets/images/successIcon3.png" />
                <br />
                <h4>ສຳເລັດແລ້ວ</h4>
                <p style={{ fontSize: 12 }}>ຂໍສະແດງຄວາມຍິນດີກັບ ການຊື້ແພັກເກັດລະບົບຄັ້ງນີ້</p>
                <Button onClick={handleLoginToLiveSystem} variant="success" >ເຂົ້າລະບົບ ໄລຟ</Button>
              </div>
              // </Watermark>
            )}
          </div>
          <br />

          <div className="d-flex w-100 gap-4">
            {getQrcode && (
              <>
                <button
                  onClick={handleCancelPayment}
                  className="btn-package-cancel w-100">
                  ຍົກເລີກ
                </button>

                <button
                  onClick={handleOpenBcelNew}
                  className="btn-package-confirm w-100">
                  ຊຳລະ
                </button>
              </>
            )}
          </div>

          {/* <p>{JSON.stringify(getQrcode)}</p> */}
        </div>
      )}
    </>
  );
}
