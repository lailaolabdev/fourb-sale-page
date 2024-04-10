import BuyPackageSystem from "../../components/packageComponent/BuyPackageSystem";
import { CheckOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { createStyles, useTheme } from "antd-style";
import React, { useEffect, useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Form, Spinner } from 'react-bootstrap';
import { TbClockSearch } from "react-icons/tb";
import { ADD_PACKAGE_SYSTEM } from "@/apollo/addpackage/mutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";
import { SHOP } from "@/apollo";
import moment from "moment";


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
  const [dataReponse, setDataResponse] = useState()

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
        // setIsDataShop(true);
        console.log("response----->", req)
        setDataResponse(req?.data?.addSystemPackages?.data);

      }
    } catch (error) {
      console.log("error:", error);
      Swal.fire({
        title: 'Oops...!',
        text: 'ຊື່ນຳໃຊ້ ແລະ ລະຫັດຜ່ານບໍ່ຖຶກຕ້ອງ',
        icon: 'error',
        timer: 5000,
        showConfirmButton: false,
      })
    }
  };

  const onConfirmForm = (e) => {
    e.preventDefault();
    if (objectData?.username?.length === "") {
      alert('username undefind')
      return
    }
    // console.log("ObjectData: ---->", objectData);
    // console.log("type: ---->", packageType);
    // setIsDataShop(!isDataShop);
    _addPackageFunction();
  };

  // find shop
  useEffect(() => {
    getShopData({
      variables: {
        where: {
          id: dataReponse?.shop?.id,
        },
      },
    });

  }, [dataReponse]);

  
  
  console.log("createdAt:====>", shopData?.shop?.createdAt)
  
  const getCreatedAtShop = moment(shopData?.shop?.createdAt).format(
    "DD/MM/YYYY"
  )
  console.log("getCreatedAtShop=======>", getCreatedAtShop)


  // useEffect(() => {
    let date = new Date(2024, 3, 1);  

    // Format the date as DD/MM/YYYY
    let formattedDate = ("0" + date.getDate()).slice(-2) + '/'
                      + ("0" + (date.getMonth() + 1)).slice(-2) + '/'
                      + date.getFullYear();

// console.log("check Monht:----->",formattedDate); 


    // if(getCreatedAtShop && getCreatedAtShop > formattedDate) {
    //   console.log("ຮ້ານໃໝ່....ຄຄຄຄ......")
    // }else {
    //   console.log("shopData===555====>", shopData)
    // }
 


  // }, [shopData?.shop?.createdAt]);






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
      {/* <div className="card-check-shop">
        <TbClockSearch style={{ fontSize: '6em', marginBottom: 20 }} />
        <h2><b>ປ້ອນລະຫັດເຂົ້າລະບົບ ໄລຟ ເພື່ອການເລືອກໃຊ້ແພັກເກັດ</b></h2>

        <Form onSubmit={onConfirmForm} style={{ width: '30em', padding: 20 }}>
          <FloatingLabel
            controlId="floatingInput"
            label="ຊື່ນຳໃຊ້"
            className="mb-3"

          >
            <Form.Control value={objectData?.username}
              onChange={(e) =>
                setObjectData({
                  ...objectData,
                  username: e?.target?.value,
                })
              } type="text" placeholder="......" />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="ລະຫັດຜ່ານ">
            <Form.Control value={objectData?.password}
              onChange={(e) =>
                setObjectData({
                  ...objectData,
                  password: e?.target?.value,
                })
              } type="text" placeholder="......." />
          </FloatingLabel>

          <br />
          <Button type="submit">{loadingAddPackage ? <Spinner /> : "save"}</Button>

        </Form>
      </div> */}
      {/* <div className="main-package-ps">
        <h1><b>ແພັກເກັດລະບົບ</b></h1>
        <p>ເລືອກຊື້ແພັກເກັດລາຄາລະບົບ 4B ໂຟບີ ເພື່ອທຸລະກິດຂອງທ່ານ</p>

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
              <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
              <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
              <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
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
              <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
              <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
              <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
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
              <li>ມີຟັງຊັ່ນຈັດການອໍເດີ້, ຈັດການອິນວອຍ</li>
              <li>ລາຍງານຍອດຂາຍ ລາຍອາທິດ, ລາຍເດືອນ, ລາຍປີ</li>
              <li>ລາຍງານຍອດເງິນຕົ້ນທືນ, ກຳໄລ</li>
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

      </div> */}
      <RiErrorWarningLine style={{fontSize:'8em', color:'orange'}} />
        <h1><b>ແຈ້ງການ</b></h1>
        <h4>ປັດຈຸບັນນີ້ທັງ ບໍລິສັດ 4B ກຳລັງມີການປັບປ່ຽນເລື່ອງລາຄາແພັກເກັດລະບົບ</h4>
        <p>ສອບຖາມຂໍ້ມູນເພິ່ມເຕີມ ໂທ: 020 29 933 969</p>

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

      {/* <RiErrorWarningLine style={{fontSize:'8em', color:'orange'}} />
        <h1><b>ແຈ້ງການ</b></h1>
        <h4>ປັດຈຸບັນນີ້ທັງ ບໍລິສັດ 4B ກຳລັງມີການປັບປ່ຽນເລື່ອງລາຄາແພັກເກັດລະບົບ</h4>
        <p>ສອບຖາມຂໍ້ມູນເພິ່ມເຕີມ ໂທ: 020 29 933 969</p> */}
    </>
  );
}
