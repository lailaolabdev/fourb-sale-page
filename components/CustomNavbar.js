import React, { useEffect, useRef, useState } from "react";
import {
  FaHistory,
  FaPage4,
  FaRegUser,
  FaRegUserCircle,
  FaSearch,
  FaShoppingCart,
  FaSignInAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { IoIosArrowForward, IoLogoWhatsapp, IoMdLogIn } from "react-icons/io";
import {
  IoClose,
  IoLogInOutline,
  IoNotifications,
  IoSettingsSharp,
} from "react-icons/io5";
import { RiListCheck3, RiListIndefinite, RiMenu2Fill } from "react-icons/ri";
import { TbLogin2, TbPhoneCall } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "@/helper/useWindowDimensions";
import { SiGooglemessages } from "react-icons/si";
import { BiMessageRounded } from "react-icons/bi";
import { MdOutlineEmail, MdOutlinePolicy } from "react-icons/md";
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
import { Modal } from "react-bootstrap";
import { googleLogout } from "@react-oauth/google";
import { FaChalkboardUser } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { S3_URL, image_main } from "@/helper";
import { Toast } from "primereact/toast";
import { GrPrevious } from "react-icons/gr";
import { GET_SHOP } from "@/apollo";
import { useLazyQuery } from "@apollo/client";
import { contactWhatsAppWitdhShop } from "@/const";
import _ from "lodash";


export default function CustomNavbar({ shopDetail }) {
  const navigate = useRouter();

  const [isShowRing, setIsShowRing] = useState(false);
  const parentDivRef = useRef(null);
  const buttonEl = useRef(null);
  const toast = useRef(null);


  const [dataBage, setDataBage] = useState(0);
  const [isCall, setIsCall] = useState(false);
  const [filterData, setFilterData] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [keyPatch, setKeyPatch] = useState();
  const [profileAccount, setProfileAccount] = useState();
  const [clientData, setClientData] = useState();
  const [shopData, setShopData] = useState()


  const dispatch = useDispatch();

  const { height, width } = useWindowDimensions();

  const { cartList } = useSelector((state) => state?.salepage);
  const { patchBack } = useSelector((state) => state?.setpatch);
  const [shopId, setShopId] = useState()

  const [getShopData, { data: loadShopData, loading: loadingShop }] = useLazyQuery(GET_SHOP, { fetchPolicy: "cache-and-network" })


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

  // useEffect(() => {
  //     const _checkdatas = cartList.filter((item) => item?.shop === patchBack?.id);
  //     if (!_.isEmpty(_checkdatas)) {
  //       const totalQty = cartList.reduce((acc, data) => {
          
  //         return acc + data?.qty;
  //       }, 0);

  //       setShopId(patchBack?.id)

  //       setDataBage(totalQty);
  //     } else {
  //       setDataBage(0);
  //     }
  //   // }
  // }, [cartList, patchBack]);
  useEffect(() => {
    const _checkdatas = cartList.filter((item) => item?.shop === patchBack?.id);
    
    if (!_.isEmpty(_checkdatas)) {
      // Calculate total quantity only for items from the specific shop
      const totalQty = _checkdatas.reduce((acc, data) => {
        return acc + (data?.qty || 0);
      }, 0);
  
      setShopId(patchBack?.id);
      setDataBage(totalQty);
    } else {
      setDataBage(0);
    }
  }, [cartList, patchBack]);


  useEffect(() => {
    if (shopDetail) {
      setShopData(shopDetail);
    } else {
      let _shopData = JSON.parse(localStorage.getItem("SP_SHOP_DATA"));
      if (_shopData) {
        setShopData(_shopData?.shop);
      } else if (loadShopData) {
        console.log({ loadShopData });
        setShopData(loadShopData?.shop);
      } else {
        setShopData(null);
      }
    }
  }, [shopDetail, loadShopData]);

  // useEffect(() => {

  //   if (shopDetail) {

  //     setShopData(shopDetail)
  //     console.log("shopDetail:::", shopDetail, shopData)
  //   } else {
  //     let _shopData = JSON.parse(localStorage.getItem("SP_SHOP_DATA"))
  //     if (_shopData) {
  //       setShopData(_shopData?.shop)
  //     } else if(loadShopData) {
  //       console.log({ loadShopData })
  //       setShopData(loadShopData?.shop)
  //     }else {
  //       setShopData()
  //     }
  //   }
  // }, [])

  useEffect(() => {
    let _shop = JSON.parse(localStorage.getItem("PATCH_KEY"));
    if (_shop) {
      setShopId(_shop?.id)
    }
  }, [])


  useEffect(() => {
    getShopData({
      variables: {
        where: {
          id: shopId
        }
      }
    })
  }, [shopId])



  const menuSmScreen = [
    {
      title: "ໜ້າຫລັກ",
      icon: <FiHome style={{ fontSize: 18 }} />,
      url: "/home",
    },
    // {
    //   title: "ກ່ຽວກັບຮ້ານ",
    //   icon: <FaPage4 style={{ fontSize: 18 }} />,
    //   url: "../about-us",
    // },
    // {
    //   title: "ຕິດຕໍ່ພວກເຮົາ",
    //   icon: <FaChalkboardUser style={{ fontSize: 18 }} />,
    //   url: "../contact-us",
    // },
    {
      title: "ປະຫວັດການຊື້",
      icon: <FaHistory style={{ fontSize: 18 }} />,
      url: "../history",
    },
    // {
    //   title: "ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ",
    //   icon: <MdOutlinePolicy style={{ fontSize: 18 }} />,
    //   url: "../policy",
    // },

    // {
    //   title: clientData?.email_verified ? "ອອກຈາກລະບົບ" : "ລ໋ອກອິນ",
    //   icon: clientData?.email_verified ? (
    //     <HiOutlineLogout style={{ fontSize: 18 }} />
    //   ) : (
    //     <IoMdLogIn style={{ fontSize: 18 }} />
    //   ),
    //   url: clientData?.email_verified ? "/sign-out" : "/sigin",
    // },
  ];

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
    setVisibleRight(false);
    setClientData();
  };


  const onMenuLink = (menu) => {
    const idPreState = JSON.parse(localStorage.getItem("PATCH_KEY"));


    // Construct the destination path based on available data
    let destinationPath = `../shop/${idPreState?.id}`;

    if (idPreState?.influencer) {
      destinationPath += `?influencer=${idPreState.influencer}`;
    }
    if (menu?.url === "/sigin") {
      setShowLogin(true);
    } else if (menu?.url === "/home") {
      navigate.push(destinationPath)
    } else if (menu?.url === "/sign-out") {
      onLogOutSalePage();
    } else {
      navigate.push(menu?.url)
    }
  };

  // click the menu home
  const onHomeMenu = async () => {
    // Retrieve the state from local storage
    const idPreState = JSON.parse(localStorage.getItem("PATCH_KEY"));


    // Construct the destination path based on available data
    let destinationPath = `../shop/${idPreState?.id}`;

    if (idPreState?.influencer) {
      destinationPath += `?influencer=${idPreState.influencer}`;
      if (idPreState?.commissionForShopId) {
        destinationPath += `&commissionForShopId=${idPreState.commissionForShopId}`;
      }
    }
    navigate.push(destinationPath);
  };


  return (
    <>
      <Toast position="top-center" ref={toast} />

      {/* <div className="nav-calling">
        <div>
          <TbPhoneCall />
        </div>
        <p>
          We are available 24/7, Need help? <span>+856 020 29-933-696</span>
        </p>
      </div> */}
      <div className="nav-top">
        <div
          className="nav-main"

        >
          {width > 800 && (
            <div className="nav-logo">
              <img
                src={image_main}
                style={{ maxWidth: 100, width: 45, borderRadius: '50em' }}
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

              <div onClick={() => navigate.push("../cartdetail")}>
                <TiShoppingCart style={{ fontSize: 23 }} />
                <p>ກະຕ່າສິນຄ້າ</p>
                <span>{dataBage ?? 0}</span>
              </div>
              {/* <div>
                <FaHistory />
                <p>ປະຫວັດການຊື້</p>
              </div> */}
              <div>
                <button ref={buttonEl} onClick={() => navigate.push("../history")}>
                  <FaHistory style={{ fontSize: 18 }} />
                  ປະຫວັດ
                </button>
              </div>
              {/* {clientData?.email_verified ? (
                <div onClick={() => setVisibleRight(true)}>
                  <img src={clientData?.picture} />
                  <p>{clientData?.name}</p>
                </div>
              ) : (
                <div>
                  <button ref={buttonEl} onClick={() => setShowLogin(true)}>
                    <IoMdLogIn style={{ fontSize: 22 }} />
                    ລ໋ອກອິນ
                  </button>
                </div>
              )} */}
            </div>
          )}
        </div>

        {width > 800 ? (
          <div className="nav-menu">
            <div className="menu-list">
              {width < 800 && <li ref={parentDivRef}
                onClick={onHomeMenu}
              >
                <span>
                  <GrPrevious />
                </span>
                <span>ໜ້າຮ້ານ ໃນເຊວເພຈ</span>
              </li>}

              <li onClick={onHomeMenu}>
                <FiHome style={{ fontSize: 15 }} />
                ໜ້າຫລັກ
              </li>
              {/* <li onClick={() => navigate.push("../about-us")}>
                <FaPage4 style={{ fontSize: 15 }} />ກ່ຽວກັບຮ້ານ</li> */}
              {/* <li onClick={() => navigate.push("../contact-us")}>
              <FaChalkboardUser style={{ fontSize: 15 }} />
                ຕິດຕໍ່ພວກເຮົາ
              </li> */}
              <li onClick={() => navigate.push("../history")}>
                <FaHistory style={{ fontSize: 15 }} />
                ປະຫວັດການຊື້</li>

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
              {/* <li onClick={() => navigate.push("../policy")}>
              <FaWhatsapp style={{ fontSize: 15 }} /> +856 020 769 681 99
              </li> */}
              <li></li>
            </div>
          </div>
        ) : (
          <div className="nav-menu">
            <div className="menu-list">
              <div onClick={() => navigate.replace(`../about-us`)} style={{ paddingLeft: 5, display: 'flex', justifyContent: 'center', gap: 5, alignItems: 'center' }}>
                <Avatar label="s" image={S3_URL + shopData?.image} shape="circle" />
                <div style={{ flexDirection: 'column', marginTop: '-.7em ', display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'start' }}>
                  <p style={{ paddingTop: 10 }}><b>{shopData?.name}</b></p>
                  <small style={{ marginTop: '-2.5em', fontSize: 11 }}>+856 020 {shopData?.phone}</small>
                </div>
              </div>
              {/* <li
                ref={parentDivRef}
                // onClick={onHomeMenu}
              onClick={() => {
                setShowMenu(false);
                setIsShowRing(!isShowRing);
              }}
              >
                <span>
                  <GrPrevious />
                </span>
                <span>ສະແດງສິນຄ້າ</span>
                <span>ໜ້າຮ້ານ ໃນເຊວເພຈ</span>
              </li> */}

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
              <li
                style={{ position: "relative" }}
                onClick={() => navigate.push("../cartdetail")}
              >
                <TiShoppingCart style={{ fontSize: 23 }} />
                {dataBage > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 0,
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
                )}
              </li>
              {/* {clientData?.email_verified ? (
                <li onClick={() => setVisibleRight(true)}>
                  <Avatar image={clientData?.picture} shape="circle" />
                </li>
              ) : (
                <li onClick={() => setShowLogin(true)}>
                  <TbLogin2 style={{ fontSize: 23 }} />
                </li>
              )} */}

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
                        onClick={() =>
                          onMenuLink(menu)
                        }
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


      <div className="card-contact-shop" onClick={() => contactWhatsAppWitdhShop(shopData?.phone)}>
        <IoLogoWhatsapp style={{ fontSize: 32 }} />
        {/* {isCall ? (
          <IoClose style={{ fontSize: 28 }} />
        ) : (
          <SiGooglemessages style={{ fontSize: 28 }} />
        )} */}

        {/* {isCall && (
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
        )} */}
      </div>

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
          <Avatar image={clientData?.picture} shape="circle" size="xlarge" />
          <div>
            <h5 style={{ marginBottom: "-.4em", paddingTop: 10, fontSize: 23 }}>
              <b>{clientData?.name}</b>
            </h5>
            <small style={{ fontSize: 12 }}>{clientData?.email}</small>
          </div>
        </div>
        <br />
        <ul className="menu-profile">
          <li onClick={() => navigate.push("../history")}>
            <FaHistory />
            ປະຫວັດ
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
