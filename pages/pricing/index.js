import BuyPackageSystem from "../../components/packageComponent/BuyPackageSystem";
import { CheckOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { createStyles, useTheme } from "antd-style";
import React, { useState } from "react";

const titleModal = (
  <span style={{ color: "green" }}>ຕໍ່ອາຍຸການໃຊ້ງານລະບົບ</span>
);

const useStyle = createStyles(({ token }) => ({
  "my-modal-mask": {
    boxShadow: `inset 0 0 15px #fff`,
  },
  "my-modal-header": {
    borderBottom: `1px dotted ${token.colorPrimary}`,
  },
  "my-modal-footer": {
    color: token.colorPrimary,
  },
  "my-modal-content": {
    border: "1px solid #333",
  },
}));

export default function index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageType, setPackageType] = useState();
  const token = useTheme();
  const { styles } = useStyle();

  const handleShowModalOneMonth = () => {
    setPackageType("ONE_MONTH");
    setIsModalOpen(true);
  };

  const handleShowModalThreeMonth = () => {
    setPackageType("THREE_MONTH");
    setIsModalOpen(true);
  };

  const handleShowModalSixMonth = () => {
    setPackageType("SIX_MONTH");
    setIsModalOpen(true);
  };

  const handleShowModal1YearMonth = () => {
    setPackageType("ONE_YEAR");
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const classNames = {
    body: styles["my-modal-body"],
    mask: styles["my-modal-mask"],
    header: styles["my-modal-header"],
    footer: styles["my-modal-footer"],
    content: styles["my-modal-content"],
  };
  const modalStyles = {
    header: {
      borderLeft: `5px solid ${token.colorPrimary}`,
      borderRadius: 0,
      paddingInlineStart: 5,
    },
    // body: {
    //   boxShadow: 'inset 0 0 5px #999',
    //   borderRadius: 5,
    // },
    mask: {
      backdropFilter: "blur(10px)",
    },
    footer: {
      borderTop: "1px solid #333",
    },
    content: {
      boxShadow: "0 0 30px #999",
    },
  };

  return (
    <>
      <div className="main-package-ps">
        <h2>ແພັກເກັດລະບົບ</h2>
        <p>ເລືອກຊື້ແພັກເກັດລາຄາລະບົບ 4B ໂຟບີ ເພື່ອທຸລະກິດຂອງທ່ານ</p>
        <div className="card-package">
          <div className="card-ps">
            <div className="card-type">
              {/* <div class="ping"></div> */}
              <p>1</p>
              <p>ເດືອນ</p>
            </div>
            <h6>1.000.000 ກີບ</h6>
            <h3>500.000 ກີບ</h3>
            <ul>
              <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
              {/* <li>ສາມາດໂພສ ຂາຍລົງ Feacbook</li> */}
              <li>ເພິ່ມສິນຄ້າເຂົ້າລະບົບແບບສະດວກສະບາຍ</li>
              <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
              <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
              <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
              {/* <li>ຈັດການລູກຄ້າຊີເອຟ</li> */}
            </ul>

            <div className="card-footer-ps">
              <button
                onClick={handleShowModalOneMonth}
                className="btn-buy-package">
                <span>ເລືອກຊື້ເລີຍ</span>
              </button>
            </div>
          </div>

          <div className="card-ps">
            <div className="card-type">
              <p>3</p>
              <p>ເດືອນ</p>
            </div>
            <h6>2.850.000 ກີບ</h6>
            <h3>1.440.000 ກີບ</h3>
            <ul>
              <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
              <li>ສາມາດໂພສ ຂາຍລົງ Feacbook</li>
              {/* <li>ເພິ່ມສິນຄ້າເຂົ້າລະບົບແບບສະດວກສະບາຍ</li> */}
              <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
              <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
              <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
              {/* <li>ຈັດການລູກຄ້າຊີເອຟ</li> */}
            </ul>

            <div className="card-footer-ps">
              <button
                onClick={handleShowModalThreeMonth}
                className="btn-buy-package">
                <span>ເລືອກຊື້ເລີຍ</span>
              </button>
            </div>
          </div>

          <div className="card-ps">
            <div className="card-type">
              <p>6</p>
              <p>ເດືອນ</p>
            </div>
            <h6>5.650.000 ກີບ</h6>
            <h3>2.790.000 ກີບ</h3>
            <ul>
              <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
              <li>ສາມາດໂພສ ຂາຍລົງ Feacbook</li>
              {/* <li>ເພິ່ມສິນຄ້າເຂົ້າລະບົບແບບສະດວກສະບາຍ</li> */}
              <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
              <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
              <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
              {/* <li>ຈັດການລູກຄ້າຊີເອຟ</li> */}
            </ul>

            <div className="card-footer-ps">
              <button
                onClick={handleShowModalSixMonth}
                className="btn-buy-package">
                <span>ເລືອກຊື້ເລີຍ</span>
              </button>
            </div>
          </div>

          <div className="card-ps">
            <div className="card-type">
              <p>1</p>
              <p>ປີ</p>
            </div>
            <h6>11.250.000 ກີບ</h6>
            <h3>4.900.000 ກີບ</h3>
            <ul>
              <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
              <li>ສາມາດໂພສ ຂາຍລົງ Feacbook</li>
              {/* <li>ເພິ່ມສິນຄ້າເຂົ້າລະບົບແບບສະດວກສະບາຍ</li> */}
              <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
              <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
              <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
              {/* <li>ຈັດການລູກຄ້າຊີເອຟ</li> */}
            </ul>

            <div className="card-footer-ps">
              <button
                onClick={handleShowModal1YearMonth}
                className="btn-buy-package">
                <span>ເລືອກຊື້ເລີຍ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        footer={null}
        // title={titleModal}
        width={700}
        closable={false}
        open={isModalOpen}
        onOk={handleOk}
        // onCancel={handleCancel}
        classNames={classNames}
        styles={modalStyles}>
        <div className="p-2">
          <BuyPackageSystem
            handleCancel={handleCancel}
            packageType={packageType}
          />
        </div>
      </Modal>
    </>
  );
}
