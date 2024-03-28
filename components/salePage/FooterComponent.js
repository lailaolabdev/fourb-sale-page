import useWindowDimensions from "../../helper/useWindowDimensions";
import { CORLOR_APP, CORLOR_WHITE } from "../../helper";
import React from "react";
import { useRouter } from "next/router";
import { URL_PACKAGE_SYSTEM } from "../../const";
const versionWeb = require("../../package.json");

export default function FooterComponent() {
  const { height, width } = useWindowDimensions();
  const navigate = useRouter();

  return (
    <div className="footer-sale-page">
      <div
        className="footer-first"
        style={{ padding: width > 700 ? "1em 3em" : "1em" }}>
        <div className="footer-title">
          <div className="logo-main">
            <img
              src="/assets/images/mainLogo.png"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <h5>Sale Page</h5>
          <small>Lailaolab ICT Solutions CO.,LTD</small>
          <br />
          <small style={{ fontSize: 13 }}>
            {" "}
            ບ້ານ ປາກ​ທ້າງ, ເມືອງ​ສີ​ໂຄດ​ຕະ​ບອງ, ນະ​ຄອນ​ຫຼວງວຽງ​ຈັນ, ປະ​ເທດ​ລາວ
          </small>
          <p>Call: +856 20 95 119 036</p>
        </div>
        <div className="footer-title">
          <div>
            <p>
              <b>ການດູແລລູກຄ້າ</b>
            </p>

            <ol>
              {/* <li onClick={()=> navigate.back()}>ໜ້າຫລັກ ເຊວເພຈ</li> */}
              {/* <li>ວິທີການສັ່ງຊື້</li> */}
              <li onClick={() => navigate.push("/policy")}><u>ນະໂຍບາຍການນຳໃຊ້</u></li>
              <li onClick={() => window.open(URL_PACKAGE_SYSTEM)}><u>ແພັກເກັດລະບົບ</u></li>
              {/* <li>ຕິດຕໍ່ພວກເຮົາ</li> */}
            </ol>
          </div>
          <div>
            <p>
              <b>ຟີເຈີີຂອງ 4B</b>
            </p>
            <ul>
              <li style={{cursor:'pointer'}} onClick={()=> window.open("https://shop.bbbb.com.la")}><u>4B Live</u></li>
              <li style={{cursor:'pointer'}} onClick={()=> window.open("https://pos.bbbb.com.la")}><u>4B POS</u></li>
              <li style={{cursor:'pointer'}} onClick={()=> window.open("https://affiliate.bbbb.com.la")}><u>4B Affiliate</u></li>
              <li style={{cursor:'pointer'}} onClick={()=> window.open("https://sp.bbbb.com.la")}><u>4B Sale Page</u></li>
              
            </ul>
          </div>
        </div>
      </div>
      <div
        className="footer-second"
        style={{ padding: width > 700 ? "1em 3em" : "1em" }}>
        <div>
          <h4>ປະເພດການຊຳລະ</h4>
          <div style={{ display: "flex", gap: 10 }}>
            <img src="/assets/images/bcel_one.png" style={{ width: 45,height:45 }} />
            <img src="/assets/images/jdbIco.png" style={{ width: 40,height: 40 }} />
            <img src="/assets/images/indochina.png" style={{ width: 40, height:40 }} />
          </div>
        </div>
        <div>
          <h4>ຂົນສົ່ງ</h4>
          <div style={{ display: "flex", gap: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  overflow: "hidden",
                }}>
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
              }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  overflow: "hidden",
                }}>
                <img
                  src="/assets/images/mixay.png"
                  style={{ width: "100%" }}
                />
              </div>
              {/* &nbsp;
              <small>ບໍລິສັດ ຂົນສົ່ງ ອານຸສິດ (ກຳລັງພັດທະນາ)</small> */}
            </div>
          </div>
        </div>
        <div>
          <h4>ຕິດຕາມພວກເຮົາ</h4>
          <div style={{ display: "flex", gap: 20 }}>
            <div
              onClick={() => {
                window.open("https://www.facebook.com/LailaoCF");
              }}>
              <img
                src="https://www.facebook.com/images/fb_icon_325x325.png"
                style={{ width: 30 }}
              />
            </div>
            <div
              onClick={() => {
                window.open("https://www.youtube.com/@cflivebylailaocf2342");
              }}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
                style={{ width: 30 }}
              />
            </div>
            <div
              onClick={() => {
                window.open("https://www.tiktok.com/@4bforbusiness");
              }}>
              <img
                src="https://play-lh.googleusercontent.com/Ui_-OW6UJI147ySDX9guWWDiCPSq1vtxoC-xG17BU2FpU0Fi6qkWwuLdpddmT9fqrA"
                style={{ width: 30 }}
              />
            </div>
            {/* <img src="/assets/images/bcelOne.png" style={{ width: 30 }} /> */}
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          background: CORLOR_APP,
          color: CORLOR_WHITE,
        }}>
        {versionWeb?.version}
      </div>
    </div>
  );
}
