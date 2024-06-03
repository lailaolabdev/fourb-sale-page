import CustomNavbar from "@/components/CustomNavbar";
import FooterComponent from "@/components/salePage/FooterComponent";
import { useRouter } from "next/router";
import React from "react";
import { RxSlash } from "react-icons/rx";

export default function contackUs() {
  const router = useRouter();
  return (
    <>
      <CustomNavbar />
      <div className="card-contact-us">
        <div className="bread-crumb">
          <span onClick={() => router.back()}>Shoping</span>
          <RxSlash />
          <span>ຕິດຕໍ່ພວກເຮົາ</span>
        </div>

        <div className="contact">
          <p style={{ textAlign: "center" }}>
            ຊ່ອງທາງການຕິດຕໍ່ອອນລາຍຂອງພວກເຮົາ ສາມາດຕິດຕາມ 4B (ໂຟບີ) For Business
            ໄດ້ທຸກແພັດຣຟອມ
          </p>
          <br />
          <img
            style={{ width: "70%" }}
            src="https://www.cloudtalk.io/wp-content/uploads/2021/12/banner_newsletter_27.12.21_share.png"
          />
          <br />
          <div
            onClick={() =>
              window.open("https://www.facebook.com/4B.forbusiness", "_blank")
            }
          >
            <img src="https://store-images.s-microsoft.com/image/apps.37935.9007199266245907.b029bd80-381a-4869-854f-bac6f359c5c9.91f8693c-c75b-4050-a796-63e1314d18c9" />
            <p>https://Facebook.com</p>
          </div>

          <div>
            <img src="https://sf-static.tiktokcdn.com/obj/eden-sg/uhtyvueh7nulogpoguhm/tiktok-icon2.png" />
            <p>https://TikTok.com</p>
          </div>
          <div>
            <img src="https://img.freepik.com/free-vector/youtube-player-icon-with-flat-design_23-2147838801.jpg?size=338&ext=jpg&ga=GA1.1.2082370165.1716768000&semt=ais_user" />
            <p>https://YouTube.com</p>
          </div>
          <div>
            <img src="https://store-images.s-microsoft.com/image/apps.8985.13655054093851568.1c669dab-3716-40f6-9b59-de7483397c3a.8b1af40f-2a98-4a00-98cd-94e485a04427?h=464" />
            <p>https://WhatsApp.com</p>
          </div>
          <div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/640px-Instagram_logo_2022.svg.png" />
            <p>https://Instagrame.com</p>
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
}
