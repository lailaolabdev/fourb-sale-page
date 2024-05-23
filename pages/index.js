import Image from "next/image";
// import mainLogo from "../images/mainLogo.png";
import useWindowDimensions from "../helper/useWindowDimensions";
import { LINK_AFFILIATE } from "../helper";
import CustomNavbar from "@/components/CustomNavbar";
import CustomFooter from "@/components/CustomFooter";

export default function Home() {
  const { height, width } = useWindowDimensions();

  return (
    <>
    <CustomNavbar />
      <div
        style={{
          width: "100%",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "1em",
        }}>
        <div
          style={{
            width: width > 700 ? "15em" : "10em",
            height: width > 700 ? "15em" : "10em",
            borderRadius: "50%",
            border: "1px solid #fefefe",
            background: "#f2f2f2",
            padding: "1em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}>
          <img src="/assets/images/mainLogo.png" style={{ width: "100%" }} />
        </div>
        <h1>
          <b>4B Sale Page</b>
        </h1>
        <h5 style={{  width:'100%', display: "flex",
            justifyContent: "center",
            alignItems: "center", }}>
          ✨Sale Page ✨ແມ່ນ ໜ້າເວັບໄຊຣ໌ທີ່ອອກແບບມາເພື່ອ ກະຕຸ້ນການຂາຍ ຫຼື ບໍລິການ <br />
          ແລະ ມີເນື້ອໃນທີ່ກະທັດຮັດ , ຕົງປະເດັນ
          ເພື່ອໃຫ້ລູກຄ້າທີ່ເຂົ້າເບິ່ງຕັດສິນໃຈ ຊື້ໄດ້ງ່າຍຂື້ນ.
        </h5>

        <div className="cart-button-register">
          <div className="btn-register-now">
            ສະໝັກນຳໃຊ້ 4B Shop
          </div>
          <div className="btn-register-now" onClick={() => {
              window.open(LINK_AFFILIATE);
            }}>
            ສະໝັກນຳໃຊ້ 4B Affiliate
          </div>
        </div>
      </div>

      <div>
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
      </div>
      <div>
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
      </div>
      <div>
      "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
      </div>

      <CustomFooter />
    </>
  );
}
