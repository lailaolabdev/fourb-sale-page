import useWindowDimensions from "../../helper/useWindowDimensions";
import { CORLOR_APP, CORLOR_WHITE } from "../../helper";
import React from "react";
import { useRouter } from "next/router";
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
          <h5>4B Sale Page</h5>
          <small>Lailaolab ICT Solutions CO.,LTD</small>
          <br />
          <small style={{ fontSize: 13 }}>
            {" "}
            ບ້ານ ປາກ​ທ້າງ, ເມືອງ​ສີ​ໂຄດ​ຕະ​ບອງ, ນະ​ຄອນ​ຫຼວງວຽງ​ຈັນ, ປະ​ເທດ​ລາວ
          </small>
        </div>
        <div className="footer-title">
          <div>
            <p>
              <b>ການດູແລລູກຄ້າ</b>
            </p>

            <ol>
              {/* <li onClick={()=> navigate.back()}>ໜ້າຫລັກ ເຊວເພຈ</li> */}
              <li>ວິທີການສັ່ງຊື້</li>
              <li onClick={() => navigate.push("/policy")}>ນະໂຍບາຍການນຳໃຊ້</li>
              <li>ຕິດຕໍ່ພວກເຮົາ</li>
            </ol>
          </div>
          <div>
            <p>
              <b>ຟີເຈີີຂອງ 4B</b>
            </p>
            <ul>
              <li>4B Shop</li>
              <li>4B POS</li>
              <li>4B Affiliate</li>
              <li>4B Sale Page</li>
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
            <img src="/assets/images/bcelOne.png" style={{ width: 50 }} />
          </div>
        </div>
        <div>
          <h4>ຂົນສົ່ງ</h4>
          <div style={{ display: "flex", gap: 20, flexDirection: "column" }}>
            <div style={{display:'flex', justifyContent:'start', alignItems:'center'}}>
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
            <div style={{display:'flex', justifyContent:'start', alignItems:'center'}}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  overflow: "hidden",
                }}>
                <img
                  src="/assets/images/anusit2.png"
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
            <img
              src="https://www.facebook.com/images/fb_icon_325x325.png"
              style={{ width: 30 }}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
              style={{ width: 30 }}
            />
            <img
              src="https://play-lh.googleusercontent.com/Ui_-OW6UJI147ySDX9guWWDiCPSq1vtxoC-xG17BU2FpU0Fi6qkWwuLdpddmT9fqrA"
              style={{ width: 30 }}
            />
            {/* <img src="/assets/images/bcelOne.png" style={{ width: 30 }} /> */}
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          backgroundColor: CORLOR_APP,
          color: CORLOR_WHITE,
        }}>
        {versionWeb?.version}
      </div>
    </div>
  );
}
