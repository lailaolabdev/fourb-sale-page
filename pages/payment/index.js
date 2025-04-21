import Form from "react-bootstrap/Form";
import { Col, Modal, Row, Spinner } from "react-bootstrap";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import {
  CREATE_PAYMENT_LINK_WITH_PHAPAY,
} from "../../apollo/order/mutation";
import { toast, ToastContainer } from "react-toastify";

import { GET_PRESIGN_URL } from "../../apollo/presignUrl/query";
import axios from "axios";
import { GET_EXCHANGRATE } from "../../apollo/exchanrage";
import {
  calculateRoundedValue,
  S3_URL,
  numberFormat,
} from "../../helper";
import { useRouter } from "next/router";
import GenQrCode from "../../components/salePage/GenQrCode";
import { CREATE_QR_AND_SUBSCRIPE_FOR_PAYMENT, ON_RECEIVE_PAYMENT_LINK } from "../../apollo/payment/mutation";
import EmptyImage from "../../components/salePage/EmptyImage";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, message, Spin } from "antd";
import { LaoAddress } from "../../const/LaoAddress";
import _ from "lodash";
import useWindowDimensions from "../../helper/useWindowDimensions";
import FooterComponent from "../../components/salePage/FooterComponent";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { bankDatas } from "../../const/selectBankData";
import html2canvas from "html2canvas";
import { removeCartItem } from "../../redux/salepage/cartReducer";
import { GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE } from "@/apollo";
import CustomNavbar from "@/components/CustomNavbar";
import { io } from "socket.io-client";
import { PAYMENT_GATEWAY_API_URL, PAYMENT_KEY } from "@/const";
import { GET_ORDERGROUPS_WITH_SALEPAGE } from "@/apollo/order/query";
import Invoice from "@/components/invoices/Invoice";
import { setOrders } from "@/redux/setOrder/orders";
import LoadingComponent from "@/components/LoadingComponent";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function payment() {
  const router = useRouter();
  // const { liveId, live, affiliateId, id, shopForAffiliateId } = router.query;
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();

  const {
    liveId,
    live,
    influencer,
    id,
    shopForAffiliateId,
    commissionForShopId,
  } = router.query;
  // const shopId = id;
  const influencerId = influencer;

  const paperStyle = {
    borderRadius: "1em",
  };

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [logistic, setLogistic] = useState("");
  const [destinationLogistic, setDestinationLogistic] = useState("");
  const [qrcodeData, setQrCodeData] = useState();
  const [getOrderId, setGetOrderId] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [amountPaided, setAmountPaided] = useState("");
  const [fileName, setFileName] = useState();
  const [file, setFile] = useState();
  const [isValidate, setIsValidate] = useState(false);
  const [enableExpress, setEnableExpress] = useState(true);
  const [dataCompleted, setDataCompleted] = useState();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("sm");
  const [minWidth, setMinWidth] = useState("lg");
  const [cartDatas, setCartDatas] = useState([]);
  const [keyPatch, setKeyPatch] = useState();
  const [customerDatas, setCustomerDatas] = useState()

  const [openSelectBank, setOpenSelectBank] = useState(false);
  const [typeBanks, setTypeBanks] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState();

  const elementCaptureRef = useRef(null);

  const handleClickOpenBank = () => {
    setOpenSelectBank(true);
  };

  const handleCloseBank = () => {
    setOpenSelectBank(false);
  };

  const [selectedOriginalProvice, setSelectedOriginalProvice] = useState();
  const [selectedOriginalDistrict, setSelectedOriginalDistrict] = useState();


  const [destinationLogisticBranches, setDestinationLogisticBranches] = useState([]);

  const [logisticBranches, setLogisticBranches] = useState([]);
  const [originalLogisticBranches, setOriginalLogisticBranches] = useState([]);
  const [preTransactionId, setPreTransactionId] = useState("");
  const [preInvoiceObj, setPreInvoiceObj] = useState({});

  const ordersState = useSelector((state) => state?.setorder);
  const { cartList } = useSelector((state) => state?.salepage);
  const { patchBack } = useSelector((state) => state?.setpatch);


  // const { setId } = useSelector((state) => state?.predata);
  const shopId = patchBack?.id;
  // const affiliateId = setId?.idPreState?.affiliateId;

  const totalPrice = cartDatas.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "cache-and-network" }
  );

  const [createOrderSalepage, { loading: loadingPayment }] = useMutation(
    CREATE_PAYMENT_LINK_WITH_PHAPAY
    // CRATE_QR_WITH_PAYMENT_GATEWAY
    // CREATE_ORDER_ON_SALE_PAGE
  );
  const [createQrPayment, { loading: loadingSubscripe }] = useMutation(
    CREATE_QR_AND_SUBSCRIPE_FOR_PAYMENT
  );
  const [getPresignUrl, { data: presignUrlData }] =
    useLazyQuery(GET_PRESIGN_URL);

  const [
    getShopCommissionFor,
    { data: shopDataCommissionFor, loading: shopLoading },
  ] = useLazyQuery(GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE, {
    fetchPolicy: "network-only",
  });
  const [loadOrderGroupWithSalepage, { data: orderGroupWithSalepage, loading: loadingOrdeWithSalepage }] = useLazyQuery(GET_ORDERGROUPS_WITH_SALEPAGE, { fetchPolicy: 'cache-and-network' })

  // subscription conform payment
  const { data: onSubscriptionPaymentLink } = useSubscription(ON_RECEIVE_PAYMENT_LINK, {
    variables: {
      "transactionId": preTransactionId,
    },
  });

  // Split link code from link
  function extractTransactionId(url) {
    try {
      // Add protocol if missing
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;

      // Create URL object
      const urlObj = new URL(fullUrl);

      // Extract linkCode
      const linkCode = urlObj.searchParams.get('linkCode');

      return linkCode;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return '';
    }
  }

  useEffect(() => {
    if (qrCodeUrl) {
      let transactionId = extractTransactionId(qrCodeUrl);
      setPreTransactionId(transactionId)
    }
  }, [qrCodeUrl]);

  useEffect(() => {
    if (onSubscriptionPaymentLink) {
      if (onSubscriptionPaymentLink?.onSubReceiveLinkCodeWithSalePage?.transactionId === preTransactionId) {
        setShowPreview(false)
        dispatch(setOrders([]));
        dispatch(removeCartItem());

        // load order group with salepage
        loadOrderGroupWithSalepage({
          variables: {
            where: {
              transactionId: onSubscriptionPaymentLink?.onSubReceiveLinkCodeWithSalePage?.transactionId,
            },
          },
        })
      }
    }
  }, [onSubscriptionPaymentLink]);

  useEffect(() => {
    if (patchBack?.id) {
      const _checkdatas = cartList.filter(
        (item) => item?.shop === patchBack?.id
      );
      setCartDatas(_checkdatas);
    }
    // loadOrderGroupWithSalepage({
    //   variables: {
    //     where: {
    //       transactionId: "526633de-dc80-45f8-a224-27712ad7a4c1",
    //     },
    //   },
    // })
  }, [patchBack, cartList]);

  useEffect(() => {
    getShopCommissionFor({
      variables: {
        where: {
          id: commissionForShopId,
        },
      },
    });
  }, [commissionForShopId]);

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

  // ຊຳລະ ------------------------->
  const handleCheckToPaid = (event) => {
    event.preventDefault();

    const showWarning = (txtSms) => {
      message.warning(txtSms);
    };

    const validateField = (value, txtSms) => {
      if (!value || value.length === 0) {
        showWarning(txtSms);
        return false;
      }
      return true;
    };

    const validateProvinceAndDistrict = (value, txtSms) => {
      if (value === undefined) {
        showWarning(txtSms);
        return false;
      }
      return true;
    };

    if (
      validateField(customerName, "ປ້ອນຊື່ ແລະ ນາມສະກຸນ ກ່ອນ") &&
      validateField(phone, "ປ້ອນເບີໂທລະສັບກ່ອນ")
      // validateField(logistic, "ປ້ອນ ຊື່ຂົນສົ່ງກ່ອນ") &&
      // validateProvinceAndDistrict(selectedOriginalProvice, "ເລືອກແຂວງກ່ອນ") &&
      // validateProvinceAndDistrict(selectedOriginalDistrict, "ເລືອກເມືອງກ່ອນ") &&
      // validateField(destinationLogistic, "ປ້ອນສາຂາປາຍທາງກ່ອນ")
    ) {
      setIsValidate(false);
      handleConfirmBank()
      // setOpenSelectBank(true);
    }
  };

  // ກັບຄືນ
  const handleGoback = () => {
    let idPreState = {
      shopId: shopId,
      affiliateId: influencerId,
    };

    if (commissionForShopId) {
      idPreState = {
        ...idPreState,
        commissionForShopId: commissionForShopId,
      };
    }

    const destinationPath =
      idPreState.shopId &&
        idPreState.influencerId &&
        idPreState.commissionForShopId
        ? `../cartdetail/${idPreState.shopId}?influencerId=${idPreState.influencerId}&commissionForShopId=${idPreState.commissionForShopId}`
        : idPreState.shopId && idPreState.influencerId
          ? `../cartdetail/${idPreState.shopId}?affiliateId=${idPreState.influencerId}`
          : `../cartdetail/${idPreState?.shopId}`;
    console.log("path_payment:----->", destinationPath);
    router.push(destinationPath);
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
    if (cartDatas) {
      // Iterate over orders
      for (let order of cartDatas) {
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

  const _filterOriginalLogisticBranches = (district, isOriginal) => {
    let _newBranches = [];
    _newBranches = logisticBranches.filter(
      (branch) => branch.district.name === district
    );
    isOriginal
      ? setOriginalLogisticBranches(_newBranches)
      : setDestinationLogisticBranches(_newBranches);
  };

  // actoin open bank to paid

  const handleConfirmBank = async () => {
    const idPreState = JSON.parse(localStorage.getItem("PATCH_KEY"));

    try {
      setIsValidate(false);
      setOpenSelectBank(false);
      // setTypeBanks(values?.type);
      if (loadingSubscripe || loadingPayment) return;

      // Convert the orders into the required format
      const convertedOrders = await (cartDatas || []).map((order) => ({
        stock: order?.id,
        shop: shopId,
        amount: order?.qty,
        price: order?.price,
        originPrice: order?.price,
        productName: order?.name,
        currency: order?.currency,
        totalPrice: order?.qty * order?.price,
      }));

      const connectField =
        "ແຂວງ " +
        selectedOriginalProvice?.province_name +
        ", " +
        "ເມືອງ " +
        selectedOriginalDistrict?.district +
        ", " +
        "ສາຂາປາຍທາງ " +
        destinationLogistic;

      let _orderGroup = {
        shop: shopId,
        sumPriceUsd: calculatorAll?.totalUsd,
        totalPrice: calculatorAll?.totalLak,
        sumPriceBaht: calculatorAll?.totalBaht,
        sumPrice: totalPrice,
        type: "SALE_PAGE",
        amount: cartDatas?.length,
        customerName,
        phone,
        logistic,
        destinationLogistic: connectField,
        // infulancer_percent: idPreState?.commissionForShopId ? _commissionForAffiliate : 0,
      };

      if (idPreState?.influencerId) {
        _orderGroup = {
          ..._orderGroup,
          infulancer: idPreState?.influencerId,
        };
      }
      if (idPreState?.commissionForShopId) {
        _orderGroup = {
          ..._orderGroup,
          commissionForShopId: idPreState?.commissionForShopId,
        };
      }

      // Create an order
      const response = await createOrderSalepage({
        variables: {
          data: {
            amount: totalPrice, // ຈຳນວນເງິນທີ່ຕ້ອງຊຳລະຢູ່ ແອັບ
            // amount: 1, // ຈຳນວນເງິນທີ່ຕ້ອງຊຳລະຢູ່ ແອັບ
            // paymentMethod: values?.type,
            description: "4B_SALE_PAGE",
            orders: convertedOrders,
            orderGroup: _orderGroup,
          },
        },
      })

      if (response) {
        setShowPreview(true);
        let _preLink = JSON.parse(response?.data?.createPaymentLinkWithPhapay?.appLink);
        setQrCodeUrl(_preLink?.redirectURL)
      }

      // .then(async (message) => {
      //   const dataResponse = message?.data?.createQrWithPaymentGateway;

      //   let compareData = {
      //     ...dataResponse,
      //     shopId: shopId,
      //     amountPaided: totalPrice,
      //   };
      //   dispatch(setDataCompleteds(compareData));
      //   setDataCompleted(compareData);
      //   setQrCodeData(dataResponse?.qrCode);

      //   /* ------ use bcel one defalt ---------- */
      //   setGetOrderId(message?.data?.createQrWithPaymentGateway?.data?.id);

      //   if (dataResponse && dataResponse.appLink) {
      //     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      //     const isDeepLink =
      //       dataResponse.appLink.startsWith("onepay://") ||
      //       dataResponse.appLink.startsWith("someOtherCustomScheme://"); // Add other schemes as needed

      //     if (isDeepLink) {
      //       if (isIOS) {
      //         window.location.href = dataResponse.appLink;
      //       } else {
      //         const iframe = document.createElement("iframe");
      //         iframe.style.display = "none";
      //         iframe.src = dataResponse.appLink;
      //         document.body.appendChild(iframe);
      //         setTimeout(() => {
      //           document.body.removeChild(iframe);
      //         }, 1000);
      //       }
      //     } else {
      //       console.log(
      //         "Not a deep link, might open in a new tab:",
      //         dataResponse.appLink
      //       );
      //     }
      //   }

      //   return;
      // });
      return;
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        title: "ລົ້ມເຫລວ!",
        text: "ລົ້ມເຫລວໃນການສັ່ງຊື້",
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }
  };

  // captrue qrcode to image
  const captureScreen = () => {
    if (elementCaptureRef.current) {
      html2canvas(elementCaptureRef.current).then((canvas) => {
        const dataURL = canvas.toDataURL("image/jpeg");

        fetch(dataURL)
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.download = "myqrcode.jpg";
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            link.remove();
            message.success("ດາວໂຫລດ QR ສຳເລັດແລ້ວ");
          });
      });
    }
  };

  // onprint bill

  // const onPrintBill = async () => {
  //   try {
  //     const printerBillData = printer.find((e) => e?.status === true);

  //     const dataImageForPrint = await html2canvas(
  //       printerBillData?.width === "80mm"
  //         ? bill80Ref.current
  //         : bill58Ref.current,
  //       {
  //         useCORS: true,
  //         scrollX: 10,
  //         scrollY: printerBillData?.width === "80mm" ? 2 : 0,
  //         scale:
  //           printerBillData?.width === "80mm"
  //             ? 560 / widthBill80
  //             : 350 / widthBill58,
  //       }
  //     );


  //     const urlByType = {
  //       ETHERNET: "ethernet",
  //       BLUETOOTH: "bluetooth",
  //       USB: "usb",
  //     };
  //     const urlForPrinter = `http://localhost:9150/${urlByType[printerBillData?.type]
  //       }/image`;

  //     const _file = await base64ToBlob(dataImageForPrint.toDataURL());
  //     const bodyFormData = new FormData();
  //     bodyFormData.append("ip", printerBillData?.ip);
  //     bodyFormData.append("port", "9100");
  //     bodyFormData.append("image", _file);
  //     bodyFormData.append("beep1", 1);
  //     bodyFormData.append("beep2", 9);

  //     await axios.post(urlForPrinter, bodyFormData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });


  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const compulsory = <span style={{ color: "orange" }}>(ບັງຄັບ)</span>;

  return (
    <>
      <CustomNavbar />
      {loadingOrdeWithSalepage && <LoadingComponent />}
      {orderGroupWithSalepage?.getOrderGroupWithSalePage?.id ? (
        <div>
          <Invoice invoiceData={orderGroupWithSalepage?.getOrderGroupWithSalePage} />
          <br />
          {/* <div style={{ paddingLeft: "2em" }}>
            <Button>ຮັບບິນສັ່ງຊື້</Button>
          </div> */}
        </div>
      ) : (
        <div className="payment-page">

          <div className="payment-form">
            <>

              <Form onSubmit={handleCheckToPaid}>
                <Row xs={1} sm={2}>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ margin: 0 }}>
                        ຊື່ ແລະ ນາມສະກຸນ {compulsory}
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
                      controlId="validationCustom01"
                    >
                      <Form.Label style={{ margin: 0 }}>
                        ເບີໂທລະສັບ {compulsory}
                      </Form.Label>
                      <span
                        style={{
                          position: "absolute",
                          left: 10,
                          top: "1.6em",
                          fontSize: "1.3em",
                        }}
                      >
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
                          background: "#fff",
                          width: "100%",
                          border: ".02em solid #ddd",
                          paddingLeft: "2.3em",
                          fontSize: "1.3em",
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
                <Row sm={1}>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ margin: 0 }}>
                        ຊື່ຂົນສົ່ງ
                      </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        placeholder="ປ້ອນຊື່ຂົນສົ່ງ"
                        value={logistic}
                        onChange={(e) => setLogistic(e?.target?.value)}
                      />
                    </Form.Group>
                  </Col>
                  {/* <Col>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ margin: 0 }}>
                      ສາຂາປາຍທາງ {compulsory}
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="ປ້ອນສາຂາປາຍທາງ"
                      value={destinationLogistic}
                      onChange={(e) => setDestinationLogistic(e?.target?.value)}
                    />
                  </Form.Group>
                </Col> */}
                </Row>
                <Row xs={1} sm={3}>
                  <Col>
                    <Form.Label style={{ margin: 5 }}>
                      ແຂວງ
                    </Form.Label>
                    <Form.Select
                      name="selectedOriginalProvice"
                      as="select"
                      size="lg"
                      value={selectedOriginalProvice?.code}
                      onChange={(e) => {
                        const _newProvince = _.find(LaoAddress, {
                          code: e.target.value,
                        });
                        setSelectedOriginalProvice(_newProvince);
                      }}
                    >
                      <option value="">--ເລືອກ--</option>
                      {LaoAddress?.map((province, pIndex) => {
                        return (
                          <option
                            value={province?.code}
                            key={"province" + pIndex}
                          >
                            {province?.province_name}
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Label style={{ margin: 5 }}>
                      ເມືອງ
                    </Form.Label>
                    <Form.Select
                      name="selectedOriginalDistrict"
                      as="select"
                      size="lg"
                      value={selectedOriginalDistrict?.code}
                      onChange={(e) => {
                        const _newDistrict = _.find(
                          selectedOriginalProvice?.district_list,
                          { code: e.target.value }
                        );
                        _filterOriginalLogisticBranches(
                          _newDistrict?.district,
                          true
                        );
                        setSelectedOriginalDistrict(_newDistrict);
                      }}
                    >
                      <option value="">--ເລືອກ--</option>
                      {selectedOriginalProvice?.district_list?.map(
                        (district, dIndex) => {
                          return (
                            <option
                              value={district?.code}
                              key={"district" + dIndex}
                            >
                              {district?.district}
                            </option>
                          );
                        }
                      )}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ margin: 5 }}>
                        ສາຂາປາຍທາງ ຢູ່ບ້ານ
                      </Form.Label>
                      <Form.Control
                        size="lg"
                        type="text"
                        placeholder="ປ້ອນສາຂາປາຍທາງ"
                        value={destinationLogistic}
                        onChange={(e) => setDestinationLogistic(e?.target?.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* <Row sm={12}>
                <Col>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>ລາຍລະອຽດ (ບໍ່ບັງຄັບ)</Form.Label>
                    <Form.Control
                      value={descriptions}
                      onChange={(e) => setDescriptions(e?.target?.value)}
                      placeholder="ປ້ອນລາຍລະອຽດ..."
                      as="textarea"
                      rows={3}
                    />
                  </Form.Group>
                </Col>
              </Row> */}

                {file && (
                  <div
                    style={{
                      width: "100%",
                      height: "260px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
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

                  </div>
                )}

                <br />
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    ເບິ່ງລາຍການສັ່ງຊື້ຂອງຂ້ອຍ
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="w-100">
                      {cartDatas?.map((data, index) => {
                        return (
                          <div
                            key={data?.id}
                            className="cartItem-product"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div className="cartImage">
                              {data?.image?.length > 0 ? (
                                <img
                                  src={S3_URL + data?.image}
                                  alt="productImage"
                                  style={{ width: 80, height: 80 }}
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
                                }}
                              >
                                <div style={{ lineHeight: 3 }}>
                                  <h6 style={{ fontSize: 13, color: "gray" }}>
                                    {data?.qty} X {numberFormat(data?.price ?? 0)}{" "}
                                    ກີບ
                                  </h6>
                                  <h6 style={{ fontSize: 13, color: "gray" }}>
                                    {numberFormat(data?.price * data?.qty ?? 0)}{" "}
                                    ກີບ
                                  </h6>
                                </div>
                                {/* <h6>ຈຳນວນ {data?.qty}</h6> */}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h6>ຈຳນວນສິນຄ້າ:</h6>
                      <h6>{cartDatas?.length} ລາຍການ</h6>
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h5>
                        <b>ເງິນລວມທີ່ຕ້ອງຈ່າຍ: </b>
                      </h5>
                      <h5>
                        <b>{numberFormat(totalPrice)} ກີບ</b>
                      </h5>
                    </div>
                  </AccordionDetails>
                </Accordion>
                <br />

                {qrcodeData !== undefined ? (
                  <>
                    <div ref={elementCaptureRef}>
                      <div className="d-flex w-100 justify-content-center align-items-center p-2">
                        Qr {typeBanks} ສຳຫຼັບການຈ່າຍເງິນ
                      </div>
                      <div className="qrcode-scanner-media">
                        <GenQrCode
                          qrcodeData={qrcodeData}
                          handleGoback={handleGoback}
                          getOrderId={getOrderId}
                          shopId={shopId}
                          affiliateId={affiliateId}
                          dataCompleted={dataCompleted}
                        />
                      </div>
                    </div>
                    <div className="download-qrcode-element">
                      <button
                        type="button"
                        className="btn-download-qrcode"
                        onClick={captureScreen}
                      >
                        ດາວໂຫລດ qr
                      </button>
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div className="btn-open-select-banks">
                  <button
                    type={
                      loadingSubscripe || loadingPayment ? "button" : "submit"
                    }
                    className="btn-confirm-bank"
                  >
                    {loadingSubscripe || loadingPayment ? (
                      <>
                        <Spinner size="sm" /> ກຳລັງກວດສອບ...
                      </>
                    ) : (
                      <>
                        {/* <CheckCircleOutlined style={{ fontSize: 20 }} /> */}
                        ຢືນຢັນການຊຳລະ
                      </>
                    )}
                  </button>
                </div>
              </Form>
            </>
          </div>
        </div>
      )}

      <Dialog
        open={openSelectBank}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseBank}
        BackdropProps={{
          invisible: true,
        }}
        PaperProps={{ style: paperStyle }}
        fullWidth={fullWidth}
        maxWidth={width > 700 ? maxWidth : minWidth}
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle>{"Use Google's location service?"}</DialogTitle> */}
        <DialogContent sx={{ padding: 3 }}>
          <DialogContentText
            sx={{ width: "100%", padding: "1em" }}
            id="alert-dialog-slide-description"
          >
            <h5 className="textHeadSelect">
              <b>ເລືອກໃຊ້ທະນາຄານ</b>
            </h5>
            <div className="card-button-banks">
              {bankDatas.map((bank, index) => (
                <div
                  key={index}
                  className="bank-actions"
                  onClick={() => handleConfirmBank(bank)}
                >
                  <img
                    src={bank?.image}
                    style={{ minWidth: 30, maxWidth: 50, height: "auto" }}
                  />
                  <h5>{bank?.title}</h5>
                </div>
              ))}

              {/* <div
                className="bank-actions"
                // onClick={handleOpenLdbTrust}
              >
                <img src="/assets/images/jdbIcon.png" />
                <h4>
                  <b>JDB Bank</b>
                </h4>
              </div>
              <div className="bank-actions">
                <img src="/assets/images/lapnet.png" />
                <h4>
                  <b>Lap Net</b>
                </h4>
              </div> */}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <ToastContainer />
      <FooterComponent />

      <Modal size="lg" centered show={showPreview} onHide={() => setShowPreview(false)}>
        <Modal.Body style={{ width: '100%', height: "85vh", maxHeight: "70em", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
          <iframe src={qrCodeUrl} title="description" style={{ width: '100%', height: '100%' }} />
        </Modal.Body>
      </Modal>
    </>
  );
}
