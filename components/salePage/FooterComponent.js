import useWindowDimensions from "../../helper/useWindowDimensions";
import { CORLOR_APP, CORLOR_WHITE, image_main } from "../../helper";
import React from "react";
import { useRouter } from "next/router";
import { URL_PACKAGE_SYSTEM } from "../../const";
import Marquee from "react-fast-marquee";
const versionWeb = require("../../package.json");

export default function FooterComponent() {
  const { height, width } = useWindowDimensions();
  const navigate = useRouter();

  return (
    <div className="footer-sale-page">
      <div
        className="footer-first"
        style={{ padding: width > 700 ? "1em 3em" : "1em" }}
      >
        <div className="footer-title">
          <div className="logo-main">
            <img
              src={image_main}
              style={{ width: "100%", height: "100%",border:'1px solid #f2f2f2', borderRadius:'50em' }}
            />
          </div>
          <p style={{fontSize:18}}><b>Sale Page</b></p>
          <small>Lailaolab ICT Solutions CO.,LTD</small>
          <br />
          <small style={{ fontSize: 13 }}>
            {" "}
            ບ້ານ ປາກ​ທ້າງ, ເມືອງ​ສີ​ໂຄດ​ຕະ​ບອງ, ນະ​ຄອນ​ຫຼວງວຽງ​ຈັນ, ປະ​ເທດ​ລາວ
          </small>
          <p style={{fontSize:14}}>ໂທ: +856 020 299-336-96</p>
        </div>
        <div className="footer-title">
          <div>
            <p>
              <b>ການດູແລລູກຄ້າ</b>
            </p>

            <ol>
              {/* <li onClick={()=> navigate.back()}>ໜ້າຫລັກ ເຊວເພຈ</li> */}
              {/* <li>ວິທີການສັ່ງຊື້</li> */}
              <li onClick={() => navigate.push("/policy")}>
                <u>ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ</u>
              </li>
              <li onClick={() => window.open(URL_PACKAGE_SYSTEM)}>
                <u>ແພັກເກັດລະບົບ</u>
              </li>
              <li>
                <u>ຕິດຕໍ່ພວກເຮົາ</u>
              </li>
              <li>
                <u>ປະຫວັດການຊື້</u>
              </li>
            </ol>
          </div>
          <div>
            <p>
              <b>ຟີເຈີຂອງ 4B</b>
            </p>
            <ul>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => window.open("https://shop.bbbb.com.la")}
              >
                <u>4B Live</u>
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => window.open("https://pos.bbbb.com.la")}
              >
                <u>4B POS</u>
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => window.open("https://affiliate.bbbb.com.la")}
              >
                <u>4B Affiliate</u>
              </li>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => window.open("https://sp.bbbb.com.la")}
              >
                <u>4B Sale Page</u>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="footer-second"
      >
        <div>
          <p>ປະເພດການຊຳລະ</p>
          <div style={{ display: "flex", gap: 10 }}>
            <img
              src="/assets/images/bcel_one.png"
              style={{ maxWidth: 45, maxHeight: 45 }}
            />
            <img
              src="/assets/images/jdbIco.png"
              style={{ maxWidth: 40, maxHeight: 40 }}
            />
            <img
              src="/assets/images/indochina.png"
              style={{ maxWidth: 40, maxHeight: 40 }}
            />
          </div>
        </div>
        <div>
          <p>ຂົນສົ່ງ</p>
          <div style={{ display: "flex", gap: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  maxWidth: 30,
                  maxHeight: 30,
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/assets/images/halLogo.png"
                  style={{ width: "100%" }}
                />
              </div>
              {/* &nbsp;
              <small>ບໍລິສັດ ຂົນສົ່ງ ຮຸ່ງອາລຸນ</small> */}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  maxWidth: 30,
                  maxHeight: 30,
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                {/* <img src="/assets/images/mixay.png" style={{ width: "100%" }} /> */}
              </div>
              {/* &nbsp;
              <small>ບໍລິສັດ ຂົນສົ່ງ ອານຸສິດ (ກຳລັງພັດທະນາ)</small> */}
            </div>
          </div>
        </div>
        <div>
          <p>ຕິດຕາມພວກເຮົາ</p>
          <div style={{ display: "flex", gap: 20 }}>
            <div
               onClick={() =>
                window.open("https://www.facebook.com/4B.forbusiness", "_blank")
              }
            >
              <img
                src="https://www.facebook.com/images/fb_icon_325x325.png"
                style={{ maxWidth: 30 }}
              />
            </div>
            <div
              onClick={() => {
                window.open("https://www.youtube.com/@cflivebylailaocf2342",  "_blank");
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                style={{ maxWidth: 30 }}
              />
            </div>
            <div
              onClick={() => {
                window.open("https://www.tiktok.com/@4bforbusiness",  "_blank");
              }}
            >
              <img
                src="https://play-lh.googleusercontent.com/Ui_-OW6UJI147ySDX9guWWDiCPSq1vtxoC-xG17BU2FpU0Fi6qkWwuLdpddmT9fqrA"
                style={{ maxWidth: 30 }}
              />
            </div>
            {/* <img src="/assets/images/bcelOne.png" style={{ width: 30 }} /> */}
          </div>
        </div>

        <div className="card-copy-right" style={{fontSize:12}}>
<p >© 4B, All Right Reserved || By Lailaolab</p>
      {versionWeb?.version}
        </div>
       
      </div>
      {/* <p style={{display:'flex',background:'none',border:'1px solid red', width:'100%', justifyContent:'center', alignItems:'center', padding:'3em 0'}}>

        </p>  */}
    </div>
  );
}
