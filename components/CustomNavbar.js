import React, { useEffect, useRef, useState } from "react";
import {
  FaHistory,
  FaRegUserCircle,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { IoIosArrowForward, IoLogoWhatsapp, IoMdLogIn } from "react-icons/io";
import {
  IoClose,
  IoLogInOutline,
  IoNotifications, 
  IoSettingsSharp,
} from "react-icons/io5";
import { RiListCheck3, RiListIndefinite, RiMenu2Fill } from "react-icons/ri";
import { TbPhoneCall } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { motion } from "framer-motion";
import CartRight from "./CartRight";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "@/helper/useWindowDimensions";
import { SiGooglemessages } from "react-icons/si";
import { BiMessageRounded } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";
import { Menubar } from "primereact/menubar";
import { SlInfo, SlMenu } from "react-icons/sl";
import { AiOutlineClose } from "react-icons/ai";
import { PiCursorClickLight } from "react-icons/pi";
import { getSearchs } from "@/redux/notiorder/getNotiorder";
import { Dialog } from "primereact/dialog";
import SiginAccount from "./SiginAccount";
import { Avatar } from "primereact/avatar";
import { Sidebar } from "primereact/sidebar";
import ProfileAccount from "./ProfileAccount";
import { Menu } from "primereact/menu";
import { HiOutlineLogout } from "react-icons/hi";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Modal } from "react-bootstrap"
import { googleLogout } from '@react-oauth/google';

export default function CustomNavbar() {
  const navigate = useRouter();

  const [isShowRing, setIsShowRing] = useState(false);
  const parentDivRef = useRef(null);
  const buttonEl = useRef(null);

  const [dataBage, setDataBage] = useState(0);
  const [isCall, setIsCall] = useState(false);
  const [filterData, setFilterData] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [keyPatch, setKeyPatch] = useState();
  const [profileAccount, setProfileAccount] = useState();
  const [clientData, setClientData] = useState();

  const dispatch = useDispatch();

  const { height, width } = useWindowDimensions();

  const { cartList } = useSelector((state) => state?.salepage);
  const { patchBack } = useSelector((state) => state?.setpatch);
  const shopId = patchBack?.id;

  // const defaultKey = localStorage.getItem("PATCH_KEY")
  useEffect(() => {
    const _data = JSON.parse(localStorage.getItem("PATCH_KEY"));
    const _client = JSON.parse(localStorage.getItem("CLIENT_DATA"));

    if (_data) {
      setKeyPatch(_data);
    }
    if (_client) {
      setClientData(_client);
    }
  }, []);

  console.log("clientData:---", clientData)

  // useEffect(() => {
  //   const _client = localStorage.setItem("CLIENT_DATA", decoded)

  //   if (_client) {
  //     set(_client);
  //   }
  // }, []);

  useEffect(() => {
    const _checkdatas = cartList.filter((item) => item?.shop === patchBack?.id);
    if (_checkdatas) {
      const totalQty = cartList.reduce((acc, data) => {
        return acc + data?.qty;
      }, 0);
      console.log("totalQty:---->", { totalQty });

      setDataBage(totalQty);
    }
  }, [cartList, patchBack]);

  // useEffect(() => {
  //   if (patchBack?.id) {
  //     const _checkdatas = cartList.filter(
  //       (item) => item?.shop === patchBack?.id
  //     );
  //     setCartDatas(_checkdatas);
  //     console.log("checkDtas:-------->", _checkdatas);
  //   }
  // }, [patchBack, cartList]);

  useEffect(() => {
    // Event listener for clicks outside the parent div
    const handleClickOutside = (event) => {
      if (
        parentDivRef.current &&
        !parentDivRef.current.contains(event.target)
      ) {
        setIsShowRing(false);
      }
    };

    // Attach the event listener to the document body
    document.body.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const onChangeFillter = (e) => {
    if (e.key === "Enter") {
      let _data = e?.target?.value;
      navigate.push(`../search?search_key=${_data}`);
      // dispatch(getSearchs(_data))
      // setFilterNew(_data);
      // localStorage.setItem("DATA_FILTER", _data);
      // setFilterData(_data);
    }
  };

  const onLogOutSalePage = () => {
    googleLogout();
    localStorage.removeItem("CLIENT_DATA");
    setProfileAccount(null);
    setVisibleRight(false)
    setClientData()
  }

  const items = [
    {
      label: profileAccount?.name,
      icon: <Avatar image={clientData?.picture} />,
      items: [
        {
          label: "LogOut",
          icon: <HiOutlineLogout />,
        },
        {
          label: "Search",
          icon: <HiOutlineLogout />,
        },
      ],
    },
    {
      label: "Profile",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
        },
      ],
    },
  ];
  const menuSmScreen = [
    {
      title: "ໜ້າຫລັກ",
      icon: <PiCursorClickLight style={{ fontSize: 18 }} />,
      url: `../shoping/${shopId}`,
    },
    {
      title: "ກ໋ຽວກັບ",
      icon: <PiCursorClickLight style={{ fontSize: 18 }} />,
      url: "../about-us",
    },
    {
      title: "ຕິດຕໍ່ພວກເຮົາ",
      icon: <PiCursorClickLight style={{ fontSize: 18 }} />,
      url: "../contact-us",
    },
    // {
    //   title: "ຕິດຕາມອໍເດີ້",
    //   icon: <PiCursorClickLight style={{ fontSize: 18 }} />,
    //   url: "/"

    // },
    {
      title: "ປະຫວັດການຊື້",
      icon: <PiCursorClickLight style={{ fontSize: 18 }} />,
      url: "../history",
    },
    {
      title: "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
      icon: <PiCursorClickLight style={{ fontSize: 18 }} />,
      url: "../policy",
    },

    // {
    //   title: "ເງື່ອນໄຂ ແລະ ຂໍ້ກຳນົດ",
    //   icon: <PiCursorClickLight style={{ fontSize: 18 }} />,
    //   url: "/"

    // },
  ];

  return (
    <>
      <div className="nav-calling">
        <div>
          <TbPhoneCall />
        </div>
        <p>
          We are available 24/7, Need help? <span>+856 020 29-933-696</span>
        </p>
      </div>
      <div className="nav-top">
        <div
          className="nav-main"
          style={{ padding: width > 800 ? "0" : ".75em" }}
        >
          {width > 800 && (
            <div className="nav-logo">
              <img
                src="/assets/images/mainLogo2.png"
                style={{ maxWidth: 100, width: 90 }}
              />
              <div>
                <h3>ໂຟບີ </h3>
                <p>FOR BUSINESS</p>
              </div>
            </div>
          )}

          <div
            className="nav-form-control"
            style={{ width: width > 800 ? "45%" : "100%" }}
          >
            <input
              type="text"
              placeholder="ຊອກຫາສິນຄ້າທີ່ທ່ານມັກ..."
              // value={filterData}
              onKeyDown={onChangeFillter}
              // onChange={(e) => setFilterData(e.target.value)}
            />

            <div className="icon-search">
              <FaSearch />
            </div>
          </div>

          {width > 800 && (
            <div className="nav-notication">
              <div>
                <IoNotifications />
                <p>ແຈ້ງການ</p>
              </div>
              <div onClick={() => navigate.push("../cartdetail")}>
                <TiShoppingCart style={{ fontSize: 25 }} />
                <p>ກະຕ່າສິນຄ້າ</p>
                <span>{dataBage ?? 0}</span>
              </div>
              {clientData?.email_verified ? (
                <div onClick={() => setVisibleRight(true)}>
                  <img src={clientData?.picture} />
                  <p>{clientData?.name}</p>
                </div>
              ) : (
                
                <div >
                  <button ref={buttonEl} onClick={() => setShowLogin(true)}>
                    <IoMdLogIn style={{ fontSize: 22 }} />
                    ລ໋ອກອິນ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

    
        {width > 800 ? (
          <div className="nav-menu">
            <div className="menu-list">
              <li ref={parentDivRef} onClick={() => setIsShowRing(!isShowRing)}>
                <span>ສະແດງ ສິນຄ້າ</span>
                <span>
                  <IoIosArrowForward />
                </span>
              </li>

              <li onClick={() => navigate.push(`../shoping/${shopId}`)}>
                ໜ້າຫລັກ
              </li>
              <li onClick={() => navigate.push("../about-us")}>ກ່ຽວກັບ</li>
              <li onClick={() => navigate.push("../contact-us")}>
                ຕິດຕໍ່ພວກເຮົາ
              </li>
              <li onClick={() => navigate.push("../history")}>ປະຫວັດການຊື້</li>

              {isShowRing && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="card-show-products"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="arrow-item" />
                  <motion.div
                    variants={{ y: 0, opacity: 0 }}
                    initial={{ y: 0, opacity: 1 }}
                    onClick={() => {
                      navigate.push(`../search?stocks=${1}`);
                      setIsShowRing(false);
                    }}
                    className="item"
                  >
                    <span>
                      <RiListCheck3 style={{ fontSize: 20 }} />
                    </span>
                    <span>ສິນຄ້າທີ່ຍັງມີສະຕ໋ອກ</span>
                  </motion.div>
                  <motion.div
                    variants={{ y: 0, opacity: 0 }}
                    initial={{ y: 0, opacity: 1 }}
                    onClick={() => {
                      navigate.push(`../search?stocks=${0}`);
                      setIsShowRing(false);
                    }}
                    className="item"
                  >
                    <span>
                      <RiListIndefinite style={{ fontSize: 20 }} />
                    </span>
                    <span>ສິນຄ້າທັງໝົດໃນສະຕ໋ອກ</span>
                  </motion.div>
                  <hr />
                  <span
                    style={{
                      fontSize: 10,
                      textAlign: "center",
                      marginTop: "-.5em",
                      color: "gray",
                    }}
                  >
                    ສະແດງສິນຄ້າທີ່ມີຈຳນວນ ຫຼື ສິນຄ້າທີ່ໝົດສະຕ໋ອກແລ້ວ
                  </span>
                </motion.div>
              )}
            </div>

            <div className="menu-list">
              <li onClick={() => navigate.push("../policy")}>
                ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ
              </li>
              {/* <li>ຂໍ້ກຳນົດ ແລະ ເງື່ອນໄຂ</li> */}
            </div>
          </div>
        ) : (
          <div className="nav-menu">
            <div className="menu-list">
              <li
                ref={parentDivRef}
                onClick={() => {
                  setShowMenu(false);
                  setIsShowRing(!isShowRing);
                }}
              >
                <span>ສະແດງ ສິນຄ້າ</span>
                <span>
                  <IoIosArrowForward />
                </span>
              </li>

              {isShowRing && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="card-show-products"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="arrow-item" />
                  <motion.div
                    variants={{ y: 0, opacity: 0 }}
                    initial={{ y: 0, opacity: 1 }}
                    onClick={() => {
                      navigate.push(`../search?stocks=${1}`);
                      setIsShowRing(false);
                    }}
                    className="item"
                  >
                    <span>
                      <RiListCheck3 style={{ fontSize: 20 }} />
                    </span>
                    <span>ສິນຄ້າທີ່ຍັງມີສະຕ໋ອກ</span>
                  </motion.div>
                  <motion.div
                    variants={{ y: 0, opacity: 0 }}
                    initial={{ y: 0, opacity: 1 }}
                    onClick={() => {
                      navigate.push(`../search?stocks=${0}`);
                      setIsShowRing(false);
                    }}
                    className="item"
                  >
                    <span>
                      <RiListIndefinite style={{ fontSize: 20 }} />
                    </span>
                    <span>ສິນຄ້າທັງໝົດໃນສະຕ໋ອກ</span>
                  </motion.div>
                  <hr />
                  <span
                    style={{
                      fontSize: 10,
                      textAlign: "center",
                      marginTop: "-.5em",
                      color: "gray",
                    }}
                  >
                    ສະແດງສິນຄ້າທີ່ມີຈຳນວນ ຫຼື ສິນຄ້າທີ່ໝົດສະຕ໋ອກແລ້ວ
                  </span>
                </motion.div>
              )}
            </div>

            <div className="menu-list">
              <li onClick={() => navigate.push("../cartdetail")}>
                <TiShoppingCart style={{ fontSize: 23 }} />
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    right: "5em",
                    fontSize: 11,
                    background: "red",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 17,
                    height: 17,
                    borderRadius: "50em",
                    color: "#fff",
                  }}
                >
                  {dataBage ?? 0}
                </span>
              </li>
              <li onClick={() => setShowMenu(!showMenu)}>
                {!showMenu ? <SlMenu /> : <AiOutlineClose />}
              </li>
            </div>

            {showMenu && (
              <motion.div
                // style={{
                //   height: "height 2s",
                //   transition: showMenu ? "500px" : ""
                // }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 4, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="menu-sm-screen"
              >
                <div onClick={() => setShowMenu(false)}>
                  {menuSmScreen.map((menu, idex) => {
                    return (
                      <motion.li
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 * idex }}
                        key={idex}
                        onClick={() => navigate.push(menu?.url)}
                      >
                        {menu?.icon}
                        {menu?.title}
                      </motion.li>
                    );
                  })}
                </div>
                {/* <div className="d-flex" style={{background:'#f2f2f2'}}>
                  <img
                    src="/assets/images/mainLogo2.png"
                    style={{ maxWidth: 100, width: 70 }}
                  />
                  <div style={{marginLeft: '-1.5em', paddingTop:26}} className="d-flex flex-column justify-conten-cent align-items-start ">
                    <p><b>ໂຟບີ</b> </p>
                    <small style={{fontSize:10}}>FOR BUSINESS</small>
                  </div>
                </div> */}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* <CartRight /> */}

      {/* <div className="card-contact-shop" onClick={() => setIsCall(!isCall)}>
        {isCall ? (
          <IoClose style={{ fontSize: 28 }} />
        ) : (
          <SiGooglemessages style={{ fontSize: 28 }} />
        )}

        {isCall && (
          <div
            className="info-call"
            style={{
              width: isCall ? "auto" : 0,
              overflow: isCall ? "" : "hidden",
              marginLeft: isCall ? "4em" : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <IoLogoWhatsapp />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <BiMessageRounded />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <MdOutlineEmail />
            </motion.div>
          </div>
        )}
      </div> */}

      <Modal
      centered
        show={showLogin}
        onHide={() => {
          if (!showLogin) return;
          setShowLogin(false);
        }}
      >
        <SiginAccount
          setProfileAccount={setProfileAccount}
          setShowLogin={setShowLogin}
        />
      </Modal>

      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        {/* <Menu model={items} className="w-100" /> */}
        <div className="d-flex gap-3">
          <Avatar
            image={clientData?.picture}
            shape="circle"
            size="xlarge"
          />
          <div>
            <h5 style={{ marginBottom: "-.4em", paddingTop: 10, fontSize: 23 }}>
              <b>{clientData?.name}</b>
            </h5>
            <small style={{ fontSize: 12 }}>{clientData?.email}</small>
          </div>
        </div>
        <br />
        <ul className="menu-profile">
          <li>
            <FaHistory />
            ປະຫວັດການເຄື່ອນໄຫວ
          </li>
          <li>
            <IoSettingsSharp />
            ຕັ້ງຄ່າໂປຣຟາຍ
          </li>
          <li onClick={onLogOutSalePage}>
            <HiOutlineLogout />
            ອອກຈາກລະບົບ
          </li>
        </ul>
      </Sidebar>
    </>
  );
}

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.2,
    },
  },
};
