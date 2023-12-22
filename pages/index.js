import Image from "next/image";
// import mainLogo from "../images/mainLogo.png";
import useWindowDimensions from "../helper/useWindowDimensions";
// import "../App.css"

export default function Home() {
  const { height, width } = useWindowDimensions();

  return (
    <>
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
            backgroundColor: "#f2f2f2",
            padding: "1em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}>
          <img src="/assets/images/mainLogo.png" style={{ width: "100%" }} />
        </div>
        <h2>
          <b>4B Sale Page</b>
        </h2>
        <p>
          ✨Sale Page ✨ແມ່ນ ໜ້າເວັບໄຊຣ໌ທີ່ອອກແບບມາເພື່ອ ກະຕຸ້ນການຂາຍ ຫຼື ບໍລິການ
          ແລະ ມີເນື້ອໃນທີ່ກະທັດຮັດ , ຕົງປະເດັນ
          ເພື່ອໃຫ້ລູກຄ້າທີ່ເຂົ້າເບິ່ງຕັດສິນໃຈ ຊື້ໄດ້ງ່າຍຂື້ນ.
        </p>
      </div>
    </>
  );
}
