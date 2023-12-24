// import React from 'react'
import { MdAdd, MdArrowBack, MdOutlineArrowBack } from "react-icons/md";

import Form from "react-bootstrap/Form";
import { Col, Row, Spinner } from "react-bootstrap";
import React, { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import copy from "clipboard-copy";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_ORDER_ON_SALE_PAGE } from "../../apollo/order/mutation";
// import bcelOne from "/assets/images/bcelOne.png";
import { toast, ToastContainer } from "react-toastify";
// import { GET_BANKS } from "../../apollo/bank/query";

import { GET_PRESIGN_URL } from "../../apollo/presignUrl/query";
import axios from "axios";
import ButtonComponent from "../../components/ButtonComponent";
import { GET_EXCHANGRATE } from "../../apollo/exchanrage";
import {
  calculateRoundedValue,
  EMPTY_IMAGE,
  S3_URL,
  numberFormat,
} from "../../helper";
import Image from "next/image";
import { useRouter } from "next/router";
import GenQrCode from "../../components/salePage/GenQrCode";
import { CREATE_QR_AND_SUBSCRIPE_FOR_PAYMENT } from "../../apollo/payment/mutation";
// import loading77 from "/assets/images/loading77.gif";
import { setDataCompleteds } from "../../redux/completedOrder/dataOrder";
import EmptyImage from "../../components/salePage/EmptyImage";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export default function payment() {
  const router = useRouter();
  const { liveId, live, affiliateId, id, shopForAffiliateId } = router.query;
  const shopId = id;
  const dispatch = useDispatch();

  // console.log("shopId In Payment=---->", id)

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [logistic, setLogistic] = useState("");
  const [destinationLogistic, setDestinationLogistic] = useState("");
  const [qrcodeData, setQrCodeData] = useState();
  const [getOrderId, setGetOrderId] = useState("");
  const [amountPaided, setAmountPaided] = useState("");
  const [fileName, setFileName] = useState();
  const [file, setFile] = useState();
  const [isValidate, setIsValidate] = useState(false);
  const [enableExpress, setEnableExpress] = useState(true);
  const [dataCompleted, setDataCompleted] = useState();

  const ordersState = useSelector((state) => state?.setorder);
  const { cartList } = useSelector((state) => state?.salepage);

  // console.log("ordersState----->", ordersState?.setOrder);

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "cache-and-network" }
  );

  const [createOrderSalepage, { loading: loadingPayment }] = useMutation(
    CREATE_ORDER_ON_SALE_PAGE
  );
  const [createQrPayment, { loading: loadingSubscripe }] = useMutation(
    CREATE_QR_AND_SUBSCRIPE_FOR_PAYMENT
  );
  const [getPresignUrl, { data: presignUrlData }] =
    useLazyQuery(GET_PRESIGN_URL);

  // ສັ່ງຊື້ສິນຄ້າໃນ sale page
  const _createOrderOnSalePage = async () => {
    try {
      if (loadingSubscripe || loadingPayment) return;

      // Convert the orders into the required format
      const convertedOrders = await (ordersState?.setOrder?.order || []).map(
        (order) => ({
          stock: order?.id,
          amount: order?.qty,
          price: order?.price,
          productName: order?.name,
          currency: order?.currency,
          totalPrice: order?.qty * order?.price,
        })
      );

      let _orderGroup = {
        shop: shopId,
        sumPriceUsd: calculatorAll?.totalUsd,
        totalPrice: calculatorAll?.totalLak,
        sumPriceBaht: calculatorAll?.totalBaht,
        sumPrice: ordersState?.setOrder?.priceToPay, // ຈຳນວນເງິນຕາມຕົວຈິງ
        // sumPrice: 1, // ຈຳນວນເງິນ ເທສ
        type: "SALE_PAGE",
        amount: cartList?.length,
        customerName,
        phone,
        logistic,
        destinationLogistic,
      };

      if (affiliateId) {
        _orderGroup = {
          ..._orderGroup,
          infulancer: affiliateId,
          commissionAffiliate: compareData?.commision,
          infulancer_percent: compareData?.commision,
        };
      } else {
        _orderGroup = { ..._orderGroup };
      }

      // Create an order
      await createOrderSalepage({
        variables: {
          data: {
            orders: convertedOrders,
            orderGroup: _orderGroup,
          },
        },
      }).then(async (message) => {
        console.log(message?.data?.createOrderSalePage?.id);
        setGetOrderId(message?.data?.createOrderSalePage?.id);
        const genqrCode = await createQrPayment({
          variables: {
            data: {
              order: message?.data?.createOrderSalePage?.id,
            },
          },
        });
        console.log({ genqrCode });
        // Check if a QR code was generated successfully
        const qrCodeValue =
          genqrCode?.data?.createQrAndSubscripeForPayment?.qrCode;

        if (qrCodeValue) {
          // Set the QR code data
          setQrCodeData(qrCodeValue);
          // console.log("onepay://qr/" + qrCodeValue)

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

          // dispatch(removeCartItem());
          setCustomerName("");
          setPhone("");
          setLogistic("");
          setDestinationLogistic("");
          const dataResponse = message?.data?.createOrderSalePage;

          // console.log("amountPaided=====>", amountPaided);
          let compareData = {
            ...dataResponse,
            shopId: shopId,
            amountPaided: amountPaided,
          };
          dispatch(setDataCompleteds(compareData));
          setDataCompleted(compareData);
          // history.push("/completed-payment", { compareData });
          // const handleBackSalePage = () => {
          // };
        }
      });
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        title: "ເກີດຄວາມຜິດພາດຂຶ້ນ!",
        text: "ລົ້ມເຫລວໃນການສັ່ງຊື້.",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // ຖ້າບໍ່ມີ onepay ແມ່ນໃຫ້ໃຊ້ໂຕອັບໂຫລດຮູບ qrcode ການຊຳລະ
  useEffect(() => {
    if (presignUrlData?.preSignedUrl?.url) {
      onFileUpload(presignUrlData?.preSignedUrl?.url);
    }
  }, [presignUrlData]);

  const onFileUpload = async (url) => {
    try {
      if (file && url) {
        const uploadfile = await axios.put(url, file, {
          headers: {
            "Content-Type": "file/*; image/*",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers":
              "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
          },
        });
        // console.log("uploadfile: ", uploadfile);
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  // ອັບໂຫລດຮູບ
  const handleUpload = async (event) => {
    try {
      setFile(event.target.files[0]);
      var ext = event.target.files[0].name.split(".").pop();
      let filename = uuidv4() + "." + ext;
      await getPresignUrl({
        variables: {
          name: filename,
        },
      });
      setFileName(filename);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // initSetting();
    _getBank(shopId);
  }, [shopId]);

  // get bank
  const _getBank = async (shopId) => {
    try {
      // let SHOP_ID = await localStorage.getItem("SHOP");
      // await getBank({
      //   variables: {
      //     where: {
      //       shop: shopId,
      //       isDeleted: false,
      //     },
      //     skip: 0,
      //     limit: 100,
      //     orderBy: "createdAt_DESC",
      //   },
      // });

      await getExchangeRate({
        variables: {
          where: {
            shop: shopId,
          },
        },
      });

      return;
    } catch (err) {
      console.log(err);
    }
  };

  // ຟັງເຊິນບັນທຶກຢູ່ໜ້າຟອມ
  const handlePayment = (event) => {
    event.preventDefault();
    if (customerName?.length === 0) {
      // setIsValidate(true);
      toast.warning("ກາລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ ລູກຄ້າກ່ອນ", {
        autoClose: 700,
      });
      // router.push(`../completedOrder`);
    } else if (phone?.length === 0) {
      toast.warning("ກາລຸນາປ້ອນເບີໂທລະສັບກ່ອນ", {
        autoClose: 700,
      });
    } else if (file === "") {
      toast.warning("ກາລຸນາເລືອກຮູບ qr ຊຳລະກ່ອນ", {
        autoClose: 700,
      });
    } else {
      setIsValidate(false);
      _createOrderOnSalePage();
    }
  };

  // ຄັດລ໋ອກເລກບັນຊີຂອງຮ້ານ
  const handleCopyCodeBanks = async () => {
    try {
      const urlCodeBanks = bankData?.banks?.data[0].bankAccount;
      await copy(urlCodeBanks);
      toast.success("ຄັດລ໋ອກເລກບັນຊີສຳເລັດແລ້ວ", {
        autoClose: 2000,
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  // ກັບຄືນ
  const handleGoback = () => {
    router.back();
  };

  // ເພິ່ມຂົນສົ່ງ
  const handleShowExpress = () => {
    setEnableExpress(!enableExpress);
  };

  const isExChangeRate = useMemo(() => {
    return loadExchangeRate?.exchangeRate;
  }, [loadExchangeRate?.exchangeRate]);

  // ຄຳນວນຈຳນວນເງິນຈາມສະກຸນເງິນ
  const calculatorAll = useMemo(() => {
    let totalLak = 0;
    let totalBaht = 0;
    let totalUsd = 0;
    let amountKip = 0;

    // Check if ordersState and setOrder are defined and if order is iterable
    if (
      ordersState?.setOrder?.order &&
      Symbol.iterator in Object(ordersState?.setOrder?.order)
    ) {
      // Iterate over orders
      for (let order of ordersState?.setOrder?.order) {
        const { currency, qty, price } = order;

        if (currency === "LAK" || currency === "ກີບ") {
          totalLak += qty * price;
        } else if (currency === "BAHT" || currency === "ບາດ") {
          totalBaht += qty * price;
        } else if (currency === "USD" || currency === "ໂດລາ") {
          totalUsd += qty * price;
        } else {
          totalLak += qty * price;
        }
      }
    }

    // Calculate amountKip with additional checks
    amountKip =
      totalLak +
        (totalBaht * isExChangeRate?.baht || 0) +
        (totalUsd * isExChangeRate?.usd || 0) || totalLak;

    // Calculate rounded value
    const roundedValue = calculateRoundedValue(amountKip / 1000) * 1000;

    setAmountPaided(roundedValue);

    return {
      totalLak,
      totalBaht,
      totalUsd,
      amountKip,
      roundedValue,
    };
  }, [ordersState?.setOrder, isExChangeRate]);

  // console.log("customerName---->", customerName)
  const _calculatePriceWithExchangeRate = (price, currency) => {
    if (["BAHT", "ບາດ"].includes(currency)) {
      return price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      // console.log("result:====>", price, isExChangeRate?.usd);
      return price * (isExChangeRate?.usd || 0);
    }

    return price;
  };

  // console.log("amountPaided4445566====>", amountPaided)

  return (
    <>
      <div className="payment-page">
        <div className="payment-form">
          <>
            <div className="header-form">
              <div className="removeIcon1" onClick={handleGoback}>
                <MdArrowBack style={{ fontSize: 20 }} />
              </div>
              <h4 style={{ marginTop: ".6em" }}>ປ້ອນຂໍ້ມູນຂອງລູກຄ້າ</h4>
              <p></p>
            </div>

            <Form onSubmit={handlePayment}>
              <Row xs={1} sm={2}>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ margin: 0 }}>
                      ຊື່ ແລະ ນາມສະກຸນ
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="ຊື່ ແລະ ນາມສະກຸນ"
                      value={customerName}
                      onChange={(e) => setCustomerName(e?.target?.value)}
                    />
                    {isValidate && customerName?.length <= 0 ? (
                      <small style={{ color: "red" }}>
                        ກາລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນກ່ອນ!
                      </small>
                    ) : (
                      ""
                    )}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    className="mb-3"
                    style={{ position: "relative" }}
                    controlId="validationCustom01">
                    <Form.Label style={{ margin: 0 }}>ເບີໂທລະສັບ</Form.Label>
                    <span
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "1.6em",
                        fontSize: "1.3em",
                      }}>
                      020{" "}
                    </span>
                    <Form.Control
                      size="lg"
                      // required
                      type="number"
                      maxLength={10} // For 8 digits and 2 hyphens: "XXX-XXX-XX"
                      minLength={8} // At least 8 digits
                      pattern="\d{3}-\d{3}-\d{2}" // This is a regular expression pattern for "XXX-XXX-XX"
                      placeholder="XXX-XXX-XX"
                      value={phone}
                      style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        border: ".02em solid #ddd",
                        paddingLeft: "3em",
                      }}
                      onChange={(e) => {
                        let phone = e?.target?.value;
                        if (phone.length > 8) {
                          setPhone(phone.substring(0, 8));
                        } else {
                          setPhone(phone);
                        }
                      }}
                      onInput={(e) => {
                        let phone = e?.target?.value;
                        if (phone.length > 8) {
                          e.preventDefault();
                        }
                      }}
                      // onChange={(e) => {
                      //   let phone = e?.target?.value;
                      //   if (phone.length > 8) return;
                      //   setPhone(phone);
                      // }}
                    />
                    {isValidate && phone?.length <= 0 ? (
                      <small style={{ color: "red" }}>
                        ກາລຸນາປ້ອນເບີໂທລະສັບກ່ອນ!
                      </small>
                    ) : (
                      ""
                    )}
                  </Form.Group>
                </Col>
              </Row>

              {enableExpress && (
                <ButtonComponent
                  onClick={handleShowExpress}
                  backgroundColor="#fff"
                  hoverBackgroundColor="#ddd"
                  hoverColor="#0056b3"
                  border="1px solid #ddd"
                  cursor="pointer"
                  textColor="#888"
                  icon={<MdAdd />}
                  text="ເພິ່ມຂົນສົ່ງ ແລະ ປາຍທາງ"
                  fontSize="1.1em"
                  fontWeight={500}
                  width="100%"
                  padding=".6em"
                  type="button"
                />
              )}

              <Form.Group className="mb-3" hidden={enableExpress}>
                <Form.Label style={{ margin: 0 }}>ບໍລິການຂົນສົ່ງ</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="ປ້ອນການລິການຂົນສົ່ງ"
                  value={logistic}
                  onChange={(e) => setLogistic(e?.target?.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" hidden={enableExpress}>
                <Form.Label style={{ margin: 0 }}>ທີ່ຢູ່ປາຍທາງ</Form.Label>
                <Form.Control
                  size="lg"
                  type="text"
                  placeholder="ຊື່ສາຂາ, ບ້ານ, ເມືອງ ແລະ ແຂວງ"
                  value={destinationLogistic}
                  onChange={(e) => setDestinationLogistic(e?.target?.value)}
                />
              </Form.Group>

              {/* <Form.Group className="mb-3 mt-2">
                  <Form.Label style={{ margin: 0 }}>
                    ອັບໂຫລດຮູບ qr ຊຳລະເພື່ອເປັນຫລັກຖານ
                  </Form.Label>
                  <Form.Control
                    size="lg"
                    placeholder="chose file in sdf"
                    type="file"
                    onChange={(event) => handleUpload(event)}
                  />
                </Form.Group>
                <span style={{ margin: 0 }}>
                  {bankData?.banks?.data[0]?.bankName || "ທະນາຄານ"}
                </span>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "3px",
                  }}>
                  <p
                    style={{
                      background: "#eeeeee",
                      padding: 8,
                      width: "90%",
                      margin: 0,
                      borderRadius: 10,
                    }}>
                    ເລກບັນຊີ: {bankData?.banks?.data[0].bankAccount}
                  </p>

                  <Button
                    variant="outline-secondary"
                    onClick={handleCopyCodeBanks}>
                    ສຳເນົາ
                  </Button>
                </div> */}

              {file && (
                <div
                  style={{
                    width: "100%",
                    height: "260px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                  }}>
                  <img
                    // src={fileName}
                    src={URL.createObjectURL(file)}
                    style={{
                      width: "100%",
                      height: "200px",
                      border: "1px solid gray",
                      borderRadius: ".3em",
                    }}
                    alt="imageqrPayment"
                  />
                  {/* <img
                      src={S3_URL + bankData?.banks?.data[0].image}
                      style={{
                        width: file ? "100%" : "60%",
                        height: "200px",
                        border: "1px solid gray",
                        borderRadius: ".3em",
                      }}
                      alt="imagebank"
                    /> */}
                </div>
              )}

              <br />
              <div
                className="action-cart-product-footer"
                style={{ marginBottom: qrcodeData ? "1em" : "5em" }}>
                <div className="w-100">
                  {ordersState?.setOrder?.order?.map((data, index) => {
                    return (
                      <div
                        key={data?.id}
                        className="cartItem-product"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                        <div className="cartImage">
                          {data?.image?.length > 0 ? (
                            <img
                              src={S3_URL + data?.image}
                              alt="productImage"
                              style={{ width: 60, height: 60 }}
                            />
                          ) : (
                            <EmptyImage />
                          )}
                        </div>
                        <div className="action-item">
                          <h5>
                            {index + 1}. {data?.name}
                          </h5>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                            }}>
                            <div>
                              <h6>{numberFormat(data?.price ?? 0)} ກີບ</h6>
                              <h6>
                                {numberFormat(data?.price * data?.qty ?? 0)} ກີບ
                              </h6>
                            </div>
                            <h6>ຈຳນວນ {data?.qty}</h6>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="action-price-amounts">
                  <h6>ຈຳນວນສິນຄ້າທັງໝົດ:</h6>
                  <h6>{ordersState?.setOrder?.order?.length} ລາຍການ</h6>
                </div>
                {/* <div className="action-price-amounts">
                    <h6>ຈຳນວນເງິນ:</h6>
                    <h6>
                      {isNaN(calculatorAll?.totalLak)
                        ? 0
                        : numberFormat(calculatorAll?.totalLak)}{" "}
                      ₭
                    </h6>
                  </div>
                  <div className="action-price-amounts">
                    <h6>{""}</h6>
                    <h6>
                      {isNaN(calculatorAll?.totalBaht)
                        ? 0
                        : numberFormat(calculatorAll?.totalBaht)}{" "}
                      ฿
                    </h6>
                  </div>
                  <div className="action-price-amounts">
                    <h6>{""}</h6>
                    <h6>
                      {isNaN(calculatorAll?.totalUsd)
                        ? 0
                        : numberFormat(calculatorAll?.totalUsd)}{" "}
                      $
                    </h6>
                  </div> */}
                <br />
                <div className="action-price-amounts">
                  <h5>ເງິນລວມທີ່ຕ້ອງຈ່າຍ:</h5>
                  <h5>{numberFormat(ordersState?.setOrder?.priceToPay)} ກີບ</h5>
                </div>

                {/* <div className="action-price-amounts">
                    <h5>ຈຳນວນສິນຄ້າທັງໝົດ:</h5>
                    <h5>{ordersState?.setOrder?.order?.length ?? 0} ລາຍການ</h5>
                  </div>
                  <div className="action-price-amounts">
                    <h5>ເງິນລວມທັງໝົດ:</h5>
                    <h5>
                      {numberFormat(
                        ordersState?.setOrder?.orderGroup?.amountKip
                      ) ?? 0}{" "}
                      ₭
                    </h5>
                  </div> */}

                {/* <div className="paid-buy">
                    <ButtonComponent
                      // onClick={handlePayment}
                      backgroundColor="#53079f"
                      hoverBackgroundColor="#53079f"
                      border="1px solid #53079f"
                      cursor="pointer"
                      textColor="#fff"
                      icon={loading || loadingPayment ? <Spinner /> : ""}
                      text={loading || loadingPayment ? "" : "ຊຳລະ"}
                      fontSize="1.1em"
                      fontWeight={500}
                      width="100%"
                      padding=".8em"
                      type="submit"
                    />
                  </div> */}
              </div>
              <div className="sectionSubmitButton">
                {qrcodeData ? (
                  <>
                    <ButtonComponent
                      onClick={() => {
                        // Create an anchor element
                        const onPayLink = document.createElement("a");
                        onPayLink.href = "onepay://qr/" + qrcodeData;
                        // Check if it's an iOS device
                        const isIOS = /iPad|iPhone|iPod/.test(
                          navigator.userAgent
                        );

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
                      }}
                      backgroundColor="#fff"
                      hoverBackgroundColor="#ff0000"
                      border="1px solid #ff0000"
                      cursor="pointer"
                      textColor="#ff0000"
                      img={
                        <Image
                          src="/assets/images/bcelOne.png"
                          alt="bankIcon"
                          width={40}
                          height={40}
                        />
                      }
                      text="ຊຳລະຜ່ານ ທະນາຄານການຄ້າ"
                      fontSize="1.1em"
                      fontWeight={500}
                      width="100%"
                      padding=".6em"
                      type="button"
                    />
                  </>
                ) : (
                  <>
                    {loadingSubscripe || loadingPayment ? (
                      <div className="loadingButton">
                       <Spin
                          indicator={
                            <LoadingOutlined
                              style={{
                                fontSize: 24,
                                color:'#fff'
                              }}
                              spin
                            />
                          }
                        />
                        &nbsp;
                        ກຳລັງລໍຖ້າ...
                      </div>
                    ) : (
                      <ButtonComponent
                        onClick={handlePayment}
                        // onClick={handlePaymenting}
                        backgroundColor="#fff"
                        hoverBackgroundColor="#ff0000"
                        border="1px solid #ff0000"
                        cursor="pointer"
                        textColor="#ff0000"
                        img={
                          <Image
                            src="/assets/images/bcelOne.png"
                            alt="bankIcon"
                            width={40}
                            height={40}
                          />
                        }
                        text="ຊຳລະຜ່ານ ທະນາຄານການຄ້າ"
                        fontSize="1.1em"
                        fontWeight={500}
                        width="100%"
                        padding=".6em"
                        // type="submit"
                      />
                    )}
                  </>
                )}
              </div>
            </Form>
          </>
          {qrcodeData !== undefined ? (
            <>
              <div className="qrcode-scanner-media">
                <GenQrCode
                  qrcodeData={qrcodeData}
                  handleGoback={handleGoback}
                  getOrderId={getOrderId}
                  shopId={shopId}
                  affiliateId={affiliateId}
                  dataCompleted={dataCompleted}
                />
                <span>Qr ຊຳລະ</span>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
