import BuyPackageSystem from "../../components/packageComponent/BuyPackageSystem";
import { CheckOutlined } from "@ant-design/icons";

import { createStyles, useTheme } from "antd-style";
import React, { useEffect, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import FloatingLabel from "react-bootstrap/FloatingLabel";
// import { Form, Spinner } from 'react-bootstrap';
import { TbClockSearch } from "react-icons/tb";
import { ADD_PACKAGE_SYSTEM } from "@/apollo/addpackage/mutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { SHOP } from "@/apollo";
import moment from "moment";
import { CORLOR_APP } from "@/helper";
import { toast } from "react-toastify";
import { Checkbox, Form, Input, message, Modal } from "antd";
import useWindowDimensions from "@/helper/useWindowDimensions";
import ReactiveButton from "reactive-button";
import CustomButton from "@/components/CustomButton";

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
  const [objectData, setObjectData] = useState({
    username: "",
    password: "",
  });
  const { height, width } = useWindowDimensions();
  const [state, setState] = useState("idle");

  const [statusShop, setStatusShop] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [transactionId, setTransactionId] = useState();
  const [getShop, setGetShop] = useState();

  const [addPackageSystem, { loading: loadingAddPackage }] = useMutation(
    ADD_PACKAGE_SYSTEM,
    { fetchPolicy: "network-only" }
  );

  const [getShopData, { data: shopData }] = useLazyQuery(SHOP, {
    fetchPolicy: "cache-and-network",
  });

  const _addPackageFunction = async () => {
    try {
      // check loading
      if (loadingAddPackage) return;

      const req = await addPackageSystem({
        variables: {
          data: {
            typepackage: packageType,
          },
          where: {
            username: objectData?.username,
            password: objectData?.password,
          },
        },
      });

      if (req?.data?.addSystemPackages?.data) {
        setTransactionId(
          req?.data?.addSystemPackages?.data?.shop?.transactionId
        );
        const _shopIdRes = req?.data?.addSystemPackages?.data;
        // console.log("check req:------>", req?.data);

        getShopData({
          variables: {
            where: {
              id: _shopIdRes?.shop?.id,
            },
          },
        });
      }
    } catch (error) {
      console.log("error:", error);
    setState("idle");
      Swal.fire({
        title: "Oops...!",
        text: "ຊື່ນຳໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ",
        icon: "error",
        timer: 5000,
        showConfirmButton: false,
      });
    }
  };

  const onConfirmForm = () => {
    setState("loading");
    // e.preventDefault();
    // console.log("objectData:----->", objectData);
    if (objectData?.username === "" || objectData?.password == "") {
      message.warning("ກະລຸນາປ້ອນຊື່ນຳໃຊ້ ແລະ ລະຫັດຜ່ານກ່ອນ!");
      return;
    }
    _addPackageFunction();
  };

  useEffect(() => {
    setGetShop(shopData);
    const momentDate = moment(shopData?.shop?.createdAt);

    const year = momentDate.format("YYYY");
    const month = momentDate.format("MM");
    const day = momentDate.format("DD");
    const dateNumber = parseInt(year + month + day);

    let nowDefaut = 20240310;

    if (dateNumber > nowDefaut) {
      console.log("new store.....");
      setObjectData({ username: "", password: "" });
      setStatusShop(false);
    } else {
      setStatusShop(true);
      setObjectData({ username: "", password: "" });
      console.log("old store.....5555");
    }
  }, [shopData]);

  const handleShowModalOneMonth = () => {
    setPackageType("ONE_MONTH");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  const handleShowModalThreeMonth = () => {
    setPackageType("THREE_MONTH");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  const handleShowModalSixMonth = () => {
    setPackageType("SIX_MONTH");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  const handleShowModal1YearMonth = () => {
    setPackageType("ONE_YEAR");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  // package new
  const onShowModalOneMonth = () => {
    setPackageType("ONE_MONTH_NEW");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  const onShowModalThreeMonth = () => {
    setPackageType("THREE_MONTH_NEW");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  const onShowModalSixMonth = () => {
    setPackageType("SIX_MONTH_NEW");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  const onShowModal1YearMonth = () => {
    setPackageType("ONE_YEAR_NEW");
    setIsModalOpen(true);
    setPreviewData({
      shopData: {
        ...shopData,
        objectData,
      },
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setPreviewData();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setPreviewData();
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
      {!getShop ? (
        <div className="card-check-shop">
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              overflow: "hidden",
              padding: 10,
              background: "#f2f2f2",
            }}
          >
            <img src="/assets/images/mainLogo.png" style={{ width: "100%" }} />
          </div>

          <h4 style={{ textAlign: "center" }}>
            <b>ປ້ອນຊື່ນຳໃຊ້ ແລະ ລະຫັດຜ່ານ ເພື່ອການເລືອກໃຊ້ແພັກເກັດຂອງທ່ານ</b>
          </h4>
          <br />

          <Form
            name="basic"
            style={{
              minWidth: "20em",
              width: "40%",
            }}
            initialValues={{
              remember: true,
            }}
            layout="vertical"
            onFinish={onConfirmForm}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="ຊື່ນຳໃຊ້"
              name="username"
              rules={[
                {
                  required: true,
                  message: "ກະລຸນາປ້ອນຊື່ນຳໃຊ້ກ່ອນ!",
                },
              ]}
            >
              <Input
                value={objectData?.username}
                onChange={(e) =>
                  setObjectData({
                    ...objectData,
                    username: e?.target?.value,
                  })
                }
                type="text"
                placeholder="ປ້ອນຊື່ນຳໃຊ້ລະບົບ"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="ລະຫັດຜ່ານ"
              name="password"
              rules={[
                {
                  required: true,
                  message: "ກະລຸນາປ້ອນລະຫັດຜ່ານກ່ອນ!",
                },
              ]}
            >
              <Input.Password
                value={objectData?.password}
                onChange={(e) =>
                  setObjectData({
                    ...objectData,
                    password: e?.target?.value,
                  })
                }
                type="password"
                placeholder="******"
                size="large"
              />
            </Form.Item>

<CustomButton type="submit" text="ຕົກລົງ" state={state}   background={CORLOR_APP}  rounded width="100%"  />
            {/* <ReactiveButton
              buttonState={state}
              idleText="ຕົກລົງ"
              loadingText="Loading"
              type="submit"
              size="large"
              color="primary"
              shadow
              width='100%'
              style={{
                borderRadius: '10px',
                
              }}
            />  */}
          </Form>
          
        </div>
      ) : (
        <>
          {statusShop ? (
            <div className="main-package-ps px-2">
              <h1>
                <b>ແພັກເກັດລະບົບ</b>
              </h1>
              <p>ເລືອກຊື້ແພັກເກັດລາຄາລະບົບ 4B ໂຟບີ ເພື່ອທຸລະກິດຂອງທ່ານ</p>
              <div style={{ paddingBottom: 20 }}>
                {/* <small style={{ color: "orange" }}>
                  ໝາຍເຫດ: ລາຄາແພັກເກັດ ຈະຖຶກປັບຂື້ນໃນທ້າຍປີ 2024 ນີ້
                </small> */}
                {/* <Button onClick={() => {
                  setObjectData({ username: '', password: '' });
                  setGetShop("")
                }} style={{ background: CORLOR_APP, border: 'none', padding: '.5em 1em' }}  >ລອງໃໝ່</Button> */}
              </div>
              <div className="card-package">
                <div className="card-ps">
                  <div className="card-type">
                    <p>1</p>
                    <p>ເດືອນ</p>
                  </div>
                  <h6>1.000.000 ກີບ</h6>
                  <h3>500.000 ກີບ</h3>
                  <ul>
                    <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
                    <li>ເພິ່ມສິນຄ້າເຂົ້າລະບົບແບບສະດວກສະບາຍ</li>
                    <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
                    <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={handleShowModalOneMonth}
                      className="btn-buy-package"
                    >
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
                    <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
                    <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={handleShowModalThreeMonth}
                      className="btn-buy-package"
                    >
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
                    <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
                    <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={handleShowModalSixMonth}
                      className="btn-buy-package"
                    >
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
                    <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
                    <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={handleShowModal1YearMonth}
                      className="btn-buy-package"
                    >
                      <span>ເລືອກຊື້ເລີຍ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="main-package-ps p-4">
              <h1>
                <b>ແພັກເກັດລະບົບ</b>
              </h1>
              <p>ເລືອກລາຄາແພັກເກັດ ສຳຫຼັບ ລະບົບດູດ ຂອງທ່ານ</p>
              {/* <Button
                onClick={() => {
                  setObjectData({ username: "", password: "" });
                  setGetShop("");
                }}
                style={{
                  background: CORLOR_APP,
                  border: "none",
                  padding: ".5em 1em",
                }}
              >
                ລອງໃໝ່
              </Button> */}
              <br />
              <div className="card-package">
                <div className="card-ps">
                  <div className="card-type">
                    <p>1</p>
                    <p>ເດືອນ</p>
                  </div>
                  <h6>735.000 ກີບ</h6>
                  <h3>599.000 ກີບ</h3>
                  <ul>
                    <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
                    <li>ເພິ່ມສິນຄ້າເຂົ້າລະບົບແບບສະດວກສະບາຍ</li>
                    <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
                    <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={onShowModalOneMonth}
                      className="btn-buy-package"
                    >
                      <span>ເລືອກຊື້ເລີຍ</span>
                    </button>
                  </div>
                </div>

                <div className="card-ps">
                  <div className="card-type">
                    <p>3</p>
                    <p>ເດືອນ</p>
                  </div>
                  <h6>3.939.000 ກີບ</h6>
                  <h3>1.499.000 ກີບ</h3>
                  <ul>
                    <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
                    <li>ສາມາດໂພສ ຂາຍລົງ Feacbook</li>
                    <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
                    <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={onShowModalThreeMonth}
                      className="btn-buy-package"
                    >
                      <span>ເລືອກຊື້ເລີຍ</span>
                    </button>
                  </div>
                </div>

                <div className="card-ps">
                  <div className="card-type">
                    <p>6</p>
                    <p>ເດືອນ</p>
                  </div>
                  <h6>3.969.000 ກີບ</h6>
                  <h3>2.890.000 ກີບ</h3>
                  <ul>
                    <li>ສາມາດໄລຟ ຂາຍເຄື່ອງຜ່ານ Feacbook</li>
                    <li>ສາມາດໂພສ ຂາຍລົງ Feacbook</li>
                    <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
                    <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={onShowModalSixMonth}
                      className="btn-buy-package"
                    >
                      <span>ເລືອກຊື້ເລີຍ</span>
                    </button>
                  </div>
                </div>

                <div className="card-ps">
                  <div className="card-type">
                    <p>1</p>
                    <p>ປີ</p>
                  </div>
                  <h6>15.876.000 ກີບ</h6>
                  <h3>5.696.000 ກີບ</h3>
                  <ul>
                    <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
                    <li>ຄອສສອນຍິງແອັດຟຣີ</li>
                    <li>ຄອສສອນການນຳໃຊ້ ai ເຂົ້າໃນການສ້າງຄອນເທັ້ນການຂາຍຟຣີ</li>
                    <li>ມີນາຍໜ້າ Affilliate ຂາຍເຄື່ອງໃນລະບົບຊ່ວຍທ່ານ.</li>
                  </ul>

                  <div className="card-footer-ps">
                    <button
                      onClick={onShowModal1YearMonth}
                      className="btn-buy-package"
                    >
                      <span>ເລືອກຊື້ເລີຍ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {/* <RiErrorWarningLine style={{fontSize:'8em', color:'orange'}} />
        <h1><b>ແຈ້ງການ</b></h1>
        <h4>ປັດຈຸບັນນີ້ທັງ ບໍລິສັດ 4B ກຳລັງມີການປັບປ່ຽນເລື່ອງລາຄາແພັກເກັດລະບົບ</h4>
        <p>ສອບຖາມຂໍ້ມູນເພິ່ມເຕີມ ໂທ: 020 29 933 969</p> */}

      <Modal
        footer={null}
        // title={titleModal}
        width={700}
        closable={false}
        open={isModalOpen}
        onOk={handleOk}
        // onCancel={handleCancel}
        classNames={classNames}
        styles={modalStyles}
      >
        <div className="p-2">
          <BuyPackageSystem
            handleCancel={handleCancel}
            packageType={packageType}
            previewData={previewData}
            transactionId={transactionId}
            setStatusShop={setStatusShop}
            setGetShop={setGetShop}
            setObjectData={setObjectData}
          />
        </div>
      </Modal>
    </>
  );
}
