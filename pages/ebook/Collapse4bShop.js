import { Card, Collapse } from "antd";
import React from "react";
import "../../styles/ebook.module.css";
import { CORLOR_APP } from "../../helper";
import FooterComponent from "../../components/salePage/FooterComponent";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const cardPackage = (
  <div className="container-package">
    <Card hoverable>
      <h1 style={{ color: CORLOR_APP }}>1 ເດືອນ</h1>
      <h5>300,000 kip</h5>
    </Card>
    <Card hoverable>
      <h1 style={{ color: CORLOR_APP }}>3 ເດືອນ</h1>
      <h5>790,000 kip</h5>
    </Card>
    <Card hoverable>
      <h1 style={{ color: CORLOR_APP }}>6 ເດືອນ</h1>
      <h5>1.470,000 kip</h5>
    </Card>
    <Card hoverable>
      <h1 style={{ color: CORLOR_APP }}>1 ປີ</h1>
      <h5>2.900,000 kip</h5>
    </Card>
  </div>
);

const contactOut = <div>
  <ul>
    <li>ເບີໂທລະສັບ ຫຼື ວອດແອ໋ບ: 020 98 962 978</li>
    <li>ທັກຫາເພຈ FaceBook: 4B ໂຟບີ For Business</li>
    <li>ຕິດຕໍ່ທາງ TikTok: 4B ໂຟບີ For Business</li>
    <li>ອີເມວ 4b</li>
  </ul>
</div>;

const items = [
  {
    key: "1",
    label: "ວິທີຕິດຕໍ່ພົວພັນກັບທິມງານ ກ່ຽວກັບລະບົບ",
    children: contactOut,
  },
  {
    key: "2",
    label: "Package ລາຄາ",
    children: cardPackage,
  },
  {
    key: "3",
    label: "This is panel header 3",
    children: <p>{text}</p>,
  },
];

export default function Collapse4bShop() {
  return (
    <>
      <div style={{ padding: 20 }}>
        <p>
          <b>ວິທີການສະໝັກນຳໃຊ້ 4B Shop</b>
        </p>
        <Collapse accordion items={items} />
      </div>

      <FooterComponent />
    </>
  );
}
