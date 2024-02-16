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

export default function BuyPackageSystem({ handleCancel, packageType }) {
  const [isDataShop, setIsDataShop] = useState(false);
  const [enableQr, setEnableQr] = useState(false);
  const [enableCompleted, setEnableCompleted] = useState(false);
  const [dataReponse, setDataResponse] = useState();
  const [getQrcode, setGetQrcode] = useState();
  const [objectData, setObjectData] = useState({
    username: "",
    password: "",
  });
  const navigate = useRouter();
  const dispatch = useDispatch();

  const [addPackageSystem, { loading: loadingAddPackage }] = useMutation(
    ADD_PACKAGE_SYSTEM,
    { fetchPolicy: "network-only" }
  );

  const [createQrPayment, { loading: loadingSubscripe }] = useMutation(
    GEN_QR_AND_SUBSCRIPE_FOR_PAYMENT_ADD_PACKAGE
  );

  // add package system function
  const _addPackageFunction = async () => {
    try {
      // check loading
      if (loadingAddPackage) return;

      const req = await addPackageSystem({
        variables: {
          data: {
            typepackage: packageType,
          },
          where: {
            username: objectData?.username,
            password: objectData?.password,
          },
        },
      });       

      if (req?.data?.addSystemPackages?.data) {
        setIsDataShop(true);
        console.log("response----->", req)
        setDataResponse(req?.data?.addSystemPackages?.data);

      }
    } catch (error) {
      console.log("error:", error); 
      Swal.fire({
        title:'Oops...!',
        text:'ຊື່ນຳໃຊ້ ແລະ ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ',
        icon:'error',
        timer:5000,
        showConfirmButton:false,
      })
    }
  };

  const handleInputNew = () => {
    setIsDataShop(false);
    setObjectData({
      username: "",
      password: "",
      typepackage: "",
    });
  };

  const handleConfirmPackage = (e) => {
    e.preventDefault();
    if(objectData?.username?.length === "") {
      alert('username undefind')
      return
    }
    // console.log("ObjectData: ---->", objectData);
    // console.log("type: ---->", packageType);
    // setIsDataShop(!isDataShop);
    _addPackageFunction();
  };

  
  // go to open app bcel
  const handleNext = async () => { 

  // console.log("transactionId: ", dataReponse?.shop?.transactionId)

    try {
      const genqrCode = await createQrPayment({
        variables: {
          data: {
            order: dataReponse?.shop?.transactionId,
            typePackage: packageType,
          },
        },
      });
      console.log({ genqrCode });
      // Check if a QR code was generated successfully
      const qrCodeValue =
        genqrCode?.data?.genQrAndSubscripeForPaymentAddPackage?.qrCode;

      if (qrCodeValue) {
        // Set the QR code data
        setGetQrcode(qrCodeValue);
        setEnableQr(true);
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
    } catch (error) {
      console.log("error:", error);
    }
  };

  console.log("qrCode====>", getQrcode);

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
    // setEnableCompleted(false);
    // setObjectData({
    //   username: "",
    //   password: "",
    //   typepackage: "",
    // });
    // setIsDataShop(false);
    // setEnableQr(false);
    // setGetQrcode("");
    console.log({getQrcode})
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
      shopId: dataReponse?.shop?.transactionId,
    },
  });

  useEffect(() => {
    if (orderSubscription) {
      // console.log("orderSubscription55====>", orderSubscription);
      if (orderSubscription?.onShopUpdatedPackage?.transactionId === dataReponse?.shop?.transactionId) {
        console.log("Completed Paid Package......"); 
        setGetQrcode("");
      }
    }
  }, [JSON.stringify(orderSubscription)]);


  return (
    <>
      {!enableQr ? (
        <Form onSubmit={handleConfirmPackage}>
          {!isDataShop ? (
            <div className="form-packag-ps">
              <h3 style={{width:'100%', textAlign:'center'}}>ສະໝັກແພັດເກັດ ລະບົບ</h3>
              <br />
              <Form.Label htmlFor="username">
                ຊື່ນຳໃຊ້ລະບົບ 4B Live: (ບັງຄັບ)
              </Form.Label>
              <Form.Control
                value={objectData?.username}
                onChange={(e) =>
                  setObjectData({
                    ...objectData,
                    username: e?.target?.value,
                  })
                }
                placeholder="ຊື່ນຳໃຊ້"
                type="text"
                id="username"
                required
                autoFocus
              />
              <br />
              <Form.Label htmlFor="password">
                ລະຫັດຜ່ານ ເຂົ້າລະບົບ 4B Live: (ບັງຄັບ)
              </Form.Label>
              <Form.Control
                value={objectData?.password}
                onChange={(e) =>
                  setObjectData({
                    ...objectData,
                    password: e?.target?.value,
                  })
                }
                placeholder="ລະຫັດຜ່ານ"
                type="text"
                id="password"
                required
              />
              <br />
              <Form.Text id="passwordHelpBlock" muted> 
                ປ້ອນຊື່ນຳໃຊ້ລະບົບ 4B Live ແລະ ລະຫັດຜ່ານ ເພື່ອຢືນຢັນການກວດສອບ ຕໍ່ອາຍຸການໃຊ້ງານ ລະບົບ 4B Live ຂອງທ່ານ ( ຂອບໃຈ ທີ່ໃຊ້ບໍລິການຂອງພວກເຮົາ)
              </Form.Text>
            </div>
          ) : (
            <div className="card-check-confirm">
              <h5>ກວດສອບບັນຊີນຳໃຊ້ລະບົບອິກຄັ້ງ</h5>

              <br />
              <Avatar size={80} style={{border:'1px solid #f2f2f2'}} src={S3_URL + dataReponse?.shop?.image} />
              <br />
              <div style={{ lineHeight: 1, marginTop: 10 }}>
                {/* <p>ID SHOP: {dataReponse?.shop?.id}</p> */}
                <h5>ຊື່ຮ້ານ: <b>{dataReponse?.shop?.name}</b></h5>
                <h5>ເບີໂທລະສັບ: <b>{dataReponse?.shop?.phone}</b></h5>
                <h5>ລາຍລະອຽດ: <b>{dataReponse?.note ?? "................."}</b></h5>
                {/* <p>ຊື່ນຳໃຊ້ລະບົບ: {dataReponse?.phone}</p> */}
              </div>
              {/* <br />
              <p>
                <b>ໝາຍເຫດ:</b> ຖ້າຫາກວ່າທ່ານຊຳລະຄ່າລະບົບໄປແລ້ວ
                ຈະບໍ່ສາມາດຄືນເງິນໄດ້ໃນທຸກກໍລະນີ.
              </p> */}
            </div>
          )}

          <br />
          <div className="d-flex justify-content-end gap-2 mt-4 w-100">
            {isDataShop && (
              <button type="button" onClick={handleInputNew} className="btn-package-cancel">
                <span>ປ້ອນຂໍ້ມູນໃໝ່</span>
              </button>
            )}
            {!isDataShop ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-package-cancel">
                  <span>ຍົກເລີກ</span>
                </button>
                <button type="submit" className="btn-package-confirm">
                  {loadingAddPackage ? <Spinner size="sm" /> : "ກວດສອບ"}
                </button>
              </>
            ) : (
              <button type="button" onClick={handleNext} className="btn-package-confirm">
                {loadingSubscripe ? <Spinner size="sm" /> : "ຢືນຢັນ"}
              </button>
            )}
          </div>
        </Form>
      ) : (
        <div className="card-qr-package">
          <p>{getQrcode && "ຊຳລະຊື້ລະບົບ 4B ໂຟບີ ເພື່ອທຸລະກິດຂອງທ່ານ"}</p>
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
                <p>ຂໍສະແດງຄວາມຍິນດີກັບ ການຊື້ແພັກເກັດລະບົບຄັ້ງນີ້</p>
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
