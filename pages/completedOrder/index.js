import Button from "react-bootstrap/Button";
import React, { useRef } from "react";
// import successIcon2 from "../../images/successIcon2.png"
import moment from "moment"
import { Watermark } from "@hirohe/react-watermark";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";  
import { CORLOR_APP, numberFormat } from "../../helper";
// import mainLogo from "/assets/images/mainLogo.png"
import { MdArrowBack, MdSimCardDownload } from "react-icons/md";
import { useRouter } from "next/router"; 
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { removeStateCompleted } from "../../redux/completedOrder/dataOrder";

export default function CompletedOrder() {
  const navigate = useRouter()
  const dispatch = useDispatch()
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
 

    const destinationPathBack = idPreState?.affiliateId && idPreState?.shopId
    ? `../shop/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}&commissionForShopId=${idPreState.commissionForShopId || ''}`
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
        const blob = dataURLtoBlob(dataURL);

        // Save the Blob as a file
        saveAs(blob, "ບິນສັ່ງຊື້ສິນຄ້າ.jpg");
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

  const txtWatermark = info?.code + "-" + numberFormat(info?.amountPaided);

  return (
    <>
      <div ref={captureElementRef} style={{ width: "100%", height: "100vh", position:'relative' }}>
        <div className="logoBusness2">
          <img src="/assets/images/mainLogo.png" alt="mainLogo" />
        </div>
        <Watermark
          text={txtWatermark}
          rotate={-20}
          textSize={12}
          fontFamily={"Times New Roman"}
          multiline={true}
          opacity={0.4}
          style={{ height: "100vh" }}>
          <div className="p-2">
            <div className="successPaymentCart">
              <div className="imageAnimationsuccess" style={{border:'1px solid #ddd', justifyContent:'center', display:'flex', padding:'1.8em'}}>
                <Image src="/assets/images/successIcon2.png" width={"100%"} height={'100%'} alt="successImage" />
              </div>
              <h2>ສຳເລັດການສັ່ງຊື້ສິນຄ້າ</h2>
              <p>💖ຂອບໃຈສຳລັບລູກຄ້າ💖</p>
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
                  <span style={{ color: "red", fontSize: 13 }}>ໝາຍເຫດ </span>{" "}
                  ກະລຸນາແຄັບໜ້ານີ້ໄວ້ ເພື່ອເປັນຫຼັກຖານໃນການສັ່ງຊື້ສິນຄ້າ!
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
            border:`1px solid ${CORLOR_APP}`,
            color: "white",
            cursor: "pointer",
          }}>
          <MdSimCardDownload style={{ fontSize: 20 }} /> &nbsp; ດາວໂຫລດ
        </Button>
      </div>
    </>
  );
}
