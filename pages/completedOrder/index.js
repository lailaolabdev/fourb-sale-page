import Button from "react-bootstrap/Button";
import React, { useRef } from "react";
// import successIcon2 from "../../images/successIcon2.png"
import moment from "moment";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { CORLOR_APP, numberFormat } from "../../helper";
// import mainLogo from "/assets/images/mainLogo.png"
import { MdArrowBack, MdPageview, MdSimCardDownload } from "react-icons/md";
import { useRouter } from "next/router";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { removeStateCompleted } from "../../redux/completedOrder/dataOrder";
import { Watermark } from "antd";
import { FaFileDownload } from "react-icons/fa";

export default function CompletedOrder() {
  const navigate = useRouter();
  const dispatch = useDispatch();
  // const params =
  // const { location } = useReactRouter();
  // const { match } = useReactRouter();
  // const { shopId } = match?.params;
  // const info = location?.state?.dataCompleted;
  // const influencerId = location?.state?.influencerId;
  const { setId } = useSelector((state) => state?.predata);
  const { dataCompleted } = useSelector((state) => state?.completedOrder);
  const { idPreState } = setId || {};
  const info = dataCompleted;

  // console.log("idPreState--6-->", setId?.idPreState?.shopId)
  // console.log("compeletedData999999-->", dataCompleted?.code)

  // const info = navigate?.query?.dataCompleted;
  const influencerId = navigate?.query?.influencerId;

  // console.log("compareData====>", info);
  // console.log("influencerId99999====>", influencerId);

  const handleBack = () => {
    const destinationPathBack =
      idPreState?.affiliateId && idPreState?.shopId
        ? `../shop/${idPreState.shopId}?affiliateId=${
            idPreState.affiliateId
          }&commissionForShopId=${idPreState.commissionForShopId || ""}`
        : `../shop/${idPreState?.shopId}`;

    navigate.push(destinationPathBack);
    // dispatch(removeStateCompleted(2))
  };
  // let text = info?.code, moment(info?.createdAt).format("DD/MM/YYYY HH:mm"),
  // {moment(info?.createdAt).format("DD/MM/YYYY HH:mm")} {info?.code}{" "}
  // {info?.code}

  const captureElementRef = useRef(null);

  const handleCaptureAndDownload = () => {
    if (captureElementRef.current) {
      html2canvas(captureElementRef.current).then((canvas) => {
        // Convert the canvas to a data URL
        const dataURL = canvas.toDataURL("image/jpeg");

        // Create a Blob from the data URL
        // const blob = dataURLtoBlob(dataURL);

        // Save the Blob as a file
        // saveAs(blob, "ບິນສັ່ງຊື້ສິນຄ້າ.jpg");
        fetch(dataURL)
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.download = "ບິນສັ່ງຊື້ສິນຄ້າ.jpg";
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(url);
            link.remove();
          });
      });
    }
  };

  // Function to convert data URL to Blob
  function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  const handleCheckOrder = () => {
    navigate.push(`../trackOrder/detail/${info?.code}`);
  };

  const txtWatermark = info?.code + "-" + numberFormat(info?.amountPaided);

  return (
    <>
      <div
        ref={captureElementRef}
        style={{ width: "100%", position: "relative" }}>
        <div className="logoBusness2">
          <img src="/assets/images/mainLogo.png" alt="mainLogo" />
        </div>
        <Watermark
          gap={[10, 10]}
          fontSize="8px"
          content={[
            info?.code,
            moment(info?.createdAt).format("DD/MM/YYYY HH:mm"),
            numberFormat(info?.amountPaided) + " KIP",
          ]}>
          <div className="p-2">
            <div className="successPaymentCart">
              <div
                className="imageAnimationsuccess"
                style={{
                  justifyContent: "center",
                  display: "flex",
                  padding: "2em",
                }}>
                <Image
                  src="/assets/images/successIcon3.png"
                  width={"100%"}
                  height={"100%"}
                  alt="successImage"
                />
              </div>
              <div
                style={{
                  width: "100%",
                  background: "#fff",
                  padding: '2em',
                  textAlign: "center",color:'green', marginTop:'-2em'
                }}>
                <h1><b>ສຳເລັດການສັ່ງຊື້ສິນຄ້າ</b></h1>
                <h5>ຂອບໃຈສຳລັບລູກຄ້າ</h5>
              </div>
              <div className="card-completed-order">
                <div className="card-display-all">
                  <div className="actionView">
                    <h6>ເລກບິນ:</h6>
                    <h6>{info?.code}</h6>
                  </div>
                  <div className="actionView">
                    <h6>ວັນທີ ເວລາ:</h6>
                    <h6>
                      {moment(info?.createdAt).format("DD/MM/YYYY HH:mm")}
                    </h6>
                  </div>
                  <div className="actionView">
                    <h6>ຈຳນວນເງິນທັງໝົດ:</h6>
                    <h6>{numberFormat(info?.amountPaided)} ກີບ</h6>
                  </div>
                </div>
                <br />
                <div style={{ fontSize: 13 }}>
                  <span style={{ color: CORLOR_APP, fontSize: 13 }}>
                    ໝາຍເຫດ{" "}
                  </span>{" "}
                  ກະລຸນາແຄັບ ຫຼື ດາວໂຫລດ
                  ບິນນີ້ໄວ້ເພື່ອເປັນຫຼັກຖານໃນການສັ່ງຊື້ສິນຄ້າ!
                </div>
              </div>
            </div>
          </div>
        </Watermark>
      </div>
      <div className="action-footer-button">
        <Button onClick={() => handleBack()} variant="outline-secondary">
          <MdArrowBack style={{ fontSize: 20 }} /> &nbsp; ກັບໄປໜ້າສິນຄ້າ
        </Button>
        <Button
          onClick={handleCaptureAndDownload}
          style={{
            backgroundColor: CORLOR_APP,
            border: `1px solid ${CORLOR_APP}`,
            color: "white",
            cursor: "pointer",
          }}>
          <FaFileDownload style={{ fontSize: 20 }} />
        </Button>
        <Button
          onClick={() => handleCheckOrder()}
          style={{
            backgroundColor: CORLOR_APP,
            border: `1px solid ${CORLOR_APP}`,
            color: "white",
            cursor: "pointer",
          }}>
          <MdPageview style={{ fontSize: 22 }} />
        </Button>
      </div>
    </>
  );
}
