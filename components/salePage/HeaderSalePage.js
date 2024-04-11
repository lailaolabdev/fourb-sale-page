import React, { useEffect, useState } from "react";

import { FiSearch } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { MdArrowUpward, MdClose, MdDns, MdOutlineClose, MdTurnedIn } from "react-icons/md";
import useWindowDimensions from "../../helper/useWindowDimensions";
import {
  COLOR_TEXT,
  CORLOR_APP,
  CORLOR_WHITE,
  LINK_AFFILIATE,
  S3_URL,
} from "../../helper";
import { Avatar } from "@mui/material";
import {
  Alert,
  Badge,
  Button,
  Divider,
  Drawer,
  Input,
  Menu,
  Space,
} from "antd";
import {
  AlignRightOutlined,
  AppstoreOutlined,
  CloseCircleOutlined,
  FileSearchOutlined,
  MailOutlined,
  PieChartOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { GET_ORDERGROUPS } from "../../apollo/order/query";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";
import LoadingComponent from "../LoadingComponent";
import { useDispatch } from "react-redux";
import { setOrderGroups } from "../../redux/setOrder/trackOrder";
import { useRouter } from "next/router";
import { URL_PACKAGE_SYSTEM } from "../../const";
import Dropdown from "react-bootstrap/Dropdown";

function HeaderSalePage({
  enableSearch,
  handleShowProfile,
  loadShopData,
  setFilter,
  filter,
  searchProduct,
  handleShowBoxSearch,
  handleHideBoxSearch,
  isMenuOpen,
  handleIsStockZero,
  handleIsStockThenZero,
  cartList,
  hadleCartProducts,
  shopId,
}) {
  const { height, width } = useWindowDimensions();
  const [openMyDrawer, setOpenMyDrawer] = useState(false);
  const [trackOrder, setTrackOrder] = useState("");
  const [orderId, setOrderId] = useState("");
  const [enableData, setEnableData] = useState(false);
  const [openTagTrack, setOpenTagTrack] = useState(false);
  const [openQueryProduct, setOpenQueryProduct] = useState(false);

  const [isOn, setIsOne] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const toggleDropdown = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const dispatch = useDispatch();
  const navigate = useRouter();

  const onCloseQueryProduct = () => {
    setOpenQueryProduct(false);
  };
  const oncloseDrawer = () => {
    setOpenMyDrawer(false);
    setOrderId("");
    setTrackOrder("");
  };

  // useLazyQuery -------------------------------------------------->
  const [
    getOrderGroupsData,
    { data: orderGroupData, loading: orderGroupLoading },
  ] = useLazyQuery(GET_ORDERGROUPS, {
    fetchPolicy: "cache-and-network",
  });

  // use useEffect for filt order for me:
  useEffect(() => {
    if (enableData) {
      if (orderId === undefined) {
        console.log("This is code: ", orderId);
        return;
      }
      getOrderGroupsData({
        variables: {
          where: {
            isDeleted: false,
            type: "SALE_PAGE",
            searchKeyWord: orderId,
          },
        },
      });
    }
  }, [enableData, orderId]);

  let totalQuantity = 0;
  for (let item of cartList) {
    totalQuantity += item?.qty;
  }

  const handleTrackOrderId = () => {
    setOrderId(trackOrder);
    setEnableData(true); // Enable data fetching when the button is clicked
  };

  const handleClick = () => {
    handleTrackOrderId();
    setEnableData(true);
  };

  if (orderGroupData?.orderGroups?.total >= 1) {
    console.log("checkOrder6789:---->", orderGroupData);
    dispatch(setOrderGroups(orderGroupData?.orderGroups?.data));
    if (
      orderGroupData?.orderGroups?.data[0]?.code === orderId ||
      orderGroupData?.orderGroups?.data[0]?.phone === orderId
    ) {
      navigate.push("/trackOrder");
    }
    // return;
  }

  const onFetchDataRest = () => {
    handleIsStockThenZero();
    setIsOpenMenu(false);
  };
  const onFetchDataNoRest = () => {
    handleIsStockZero();
    setIsOpenMenu(false);
  };

  const onSearchDataInput = () => {
    handleShowBoxSearch();
    setIsOpenMenu(false);
  };
  const onCloseCardSearch = () => {
    handleHideBoxSearch();
    setFilter("");
    setIsOpenMenu(false);
  };

  return (
    <div>
      <div className="headerSalePage">
        <div
          className="card-profile-shop"
          style={{
            width:'100%',
            // width: isOn ? (width < 800 ? "100%" : "20em") : "0",
            height: isOn ? "20em" : "0",
            borderBottomRightRadius: !isOn ? "1em" : "0",
          }}
          data-isprofile={isOn ? "true" : "false"}
        >
           
            
             <div style={{ lineHeight: 1, padding: 10 }}>
             {loadShopData?.image &&
              <Avatar
                alt={loadShopData?.name}
                src={S3_URL + loadShopData?.image}
                sx={{
                  width: 56,
                  height: 56,
                  background: CORLOR_WHITE,
                  color: CORLOR_APP,
                  marginBottom:1
                }}
              />}
             <h1>ຊື່ຮ້ານ: {loadShopData?.name}</h1>
             <h4>ເບີໂທ: {loadShopData?.phone}</h4>
             <p>ບ້ານ: {loadShopData?.address?.village}</p>
             <p>ເມືອງ: {loadShopData?.address?.district}</p>
             <p>ແຂວງ: {loadShopData?.address?.province}</p>
           </div>
           

         <div style={{width:'100%',display:'flex', justifyContent:'center'}}>
         <div className="close-profile" onClick={() => setIsOne(false)}>
              <MdArrowUpward />
            </div>
         </div>
        </div>
        <div className="shopProfile">
          <div className="imgShop" onClick={() => setIsOne(true)}>
            {/* <FaUserAlt /> */}
            {loadShopData?.image ? (
              <Avatar
                alt={loadShopData?.name}
                src={S3_URL + loadShopData?.image}
                sx={{
                  width: 56,
                  height: 56,
                  background: CORLOR_WHITE,
                  color: CORLOR_APP,
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  background: CORLOR_WHITE,
                  color: COLOR_TEXT,
                }}
                alt="emptyImage"
                icon={<FaUserAlt />}
              />
            )}
          </div>
          &nbsp;
          {width > 410 && (
            <div className="shopName">
              <span>{loadShopData?.name}</span>

              <span style={{ fontSize: "13px" }}>
                020 {loadShopData?.phone ?? "-"}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: enableSearch ? 0 : "-10em",
          }}
          className="card-search-data"
        >
          <div className="icon-search-data">
            <FiSearch />
          </div>
          <input
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            onKeyDown={searchProduct}
            type="text"
            placeholder="ປ້ອນຊື່ສິນຄ້າ ແລ້ວ enter"
            className="form-control-search"
          />
          <div onClick={onCloseCardSearch} className="icon-close-search">
            <MdOutlineClose />
          </div>
        </div>

        <div className="menu-navs">
          <div onClick={onSearchDataInput}>
            <SearchOutlined />
            {width > 800 && <p>ຄົ້ນຫາສິນຄ້າ</p>}
          </div>
          <div style={{ position: "relative" }} onClick={toggleDropdown}>
            <FileSearchOutlined />
            {width > 800 && <p>ສິນຄ້າເພິ່ມເຕີມ</p>}

            {isOpenMenu && (
              <div
                className="card-query-product"
                style={{
                  position: "absolute",
                  top: width > 700 ? 60 : 35,
                  right: width > 700 ? 0 : "-6em",
                  zIndex: 999,
                }}
              >
                <ul onClick={(e) => e.stopPropagation()}>
                  <li onClick={onFetchDataRest}>ສະແດງສິນຄ້າຍັງເຫຼືອ</li>
                  <li onClick={onFetchDataNoRest}>ສະແດງສິນຄ້າທັງໝົດ</li>
                </ul>
              </div>
            )}
          </div>
          <div onClick={hadleCartProducts}>
            <Badge
              offset={[10, -7]}
              overflowCount={10}
              count={isNaN(totalQuantity) ? 0 : totalQuantity ?? 0}
            >
              <ShoppingCartOutlined
                style={{ fontSize: "1.4em", color: CORLOR_WHITE }}
              />{" "}
            </Badge>
            {width > 800 && <p>ກະຕ່າຂອງຂ້ອຍ</p>}
          </div>
          &nbsp;&nbsp;
          <div onClick={() => setOpenMyDrawer(true)}>
            <AlignRightOutlined />
          </div>
        </div>
      </div>

      {/* track order for me */}
      <div
        className="card-track-order-now"
        style={{ top: openTagTrack ? 0 : "-100%" }}
      >
        <div className="tag-query-data">
          <ul onClick={() => setOpenTagTrack(false)}>
            <li onClick={() => handleIsStockZero()}>
              <MdDns style={{ fontSize: 23 }} />
              <p>ສະແດງສິນຄ້າທັງໝົດ</p>
            </li>
            <li onClick={() => handleIsStockThenZero()}>
              <MdTurnedIn style={{ fontSize: 23 }} />
              <p>ສະແດງສິນຄ້າຍັງເຫຼືອ</p>
            </li>
          </ul>
        </div>
      </div>
      {/* track order for me */}

      <Drawer
        title="ເມນູທັງໝົດ"
        placement="right"
        onClose={oncloseDrawer}
        open={openMyDrawer}
      >
        <ul onClick={oncloseDrawer} className="menu-drawer">
          <li onClick={() => navigate.push("/policy")}>
            <SafetyOutlined style={{ fontSize: 23 }} />
            <p>ນະໂຍບາຍການນຳໃຊ້</p>
          </li>

          <li onClick={() => window.open(URL_PACKAGE_SYSTEM)}>
            <QuestionCircleOutlined style={{ fontSize: 20, paddingLeft: 3 }} />
            <p>ແພັກເກັດລະບົບ</p>
          </li>
          {/* <li onClick={() => handleIsStockThenZero()}>
            <QuestionCircleOutlined style={{ fontSize: 20, paddingLeft: 3 }} />
            <p>ວິທີການນຳໃຊ້ 4B Sale Page </p>
          </li> */}

          {/* <li
          // onClick={() => navigate.push("/ebook/Collapse4bShop")}
          >
            <ShopOutlined style={{ fontSize: 20, paddingLeft: 3 }} />
            <p>ວິທີສະໝັກ ເປີດຮ້ານ </p>
          </li> */}

          <li
            onClick={() => {
              window.open(LINK_AFFILIATE);
            }}
          >
            <UserSwitchOutlined style={{ fontSize: 20, paddingLeft: 3 }} />
            <p>ສະໝັກນຳໃຊ້ ອາຟຣີລີເອດ </p>
          </li>
        </ul>

        <Divider />
        <p style={{ width: "100%", textAlign: "center" }}>
          ປ້ອນເລກບິນ ຫຼື ເບີໂທ ເພື່ອກວດສອບອໍເດີ້ຂອງທ່ານ
        </p>
        <div>
          <Space.Compact
            style={{
              width: "100%",
            }}
          >
            <Input
              value={trackOrder}
              onChange={(e) => setTrackOrder(e?.target?.value)}
              status={CORLOR_APP}
              size="large"
              placeholder="ເລກບິນອໍເດີ້ ຫຼື ເບີໂທລະສັບ"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  if (trackOrder === undefined) return;
                  e.preventDefault(); // Prevent form submission
                  handleTrackOrderId(); // Don't enable data fetching on Enter key press
                }
              }}
            />
            <Button
              onClick={handleClick}
              style={{ background: CORLOR_APP }}
              size="large"
              type="primary"
              icon={<SendOutlined />}
            />
          </Space.Compact>

          <div
            style={{
              height: "5em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "5em",
            }}
          >
            {orderGroupLoading && (
              <LoadingComponent
                titleLoading="ກຳລັງຄົ້ນຫາອໍເດີ້..."
                height={"40px"}
                width={"40px"}
              />
            )}

            {orderGroupData?.orderGroups?.total <= 0 && (
              <Alert
                message={`ຄົ້ນຫາບໍ່ພົບອໍເດີ້ ${orderId}`}
                description="ອໍເດີ້ນີ້ບໍ່ມີຢູ່ໃນລະບົບ ກະລຸນາປ້ອນລະຫັດອໍເດີ້ທີ່ຖຶກຕ້ອງ!"
                type="warning"
                showIcon
                closable
              />
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default HeaderSalePage;
