import React, { useEffect, useState } from "react";

import { FiSearch } from "react-icons/fi";
import { FaUserAlt } from "react-icons/fa";
import { MdDns, MdOutlineClose, MdTurnedIn } from "react-icons/md";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { CORLOR_APP, CORLOR_WHITE, LINK_AFFILIATE, S3_URL } from "../../helper";
import { Avatar } from "@mui/material";
import {
  Alert,
  Badge,
  Button,
  Divider,
  Drawer,
  Dropdown,
  Input,
  Space,
} from "antd";
import {
  AlignRightOutlined,
  FileSearchOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  SearchOutlined,
  SendOutlined,
  ShopOutlined,
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
import { toast } from "react-toastify";

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

  const dispatch = useDispatch();
  const navigate = useRouter();

  const handelTrackOrderNow = () => {
    setOpenTagTrack(!openTagTrack);
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
          isDeleted: false,
          invoiceStatus: "WAITING",
          where: {
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
    dispatch(setOrderGroups(orderGroupData?.orderGroups?.data));
    if (orderGroupData?.orderGroups?.data[0]?.code === orderId) {
      navigate.push("/trackOrder");
    }
    // return;
  }

  return (
    <div>
      <div className="headerSalePage">
        {!enableSearch && (
          <div className="shopProfile">
            <div className="imgShop" onClick={handleShowProfile}>
              {/* <FaUserAlt /> */}
              {loadShopData?.image ? (
                <Avatar
                  alt={loadShopData?.name}
                  src={S3_URL + loadShopData?.image}
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: CORLOR_WHITE,
                    color: CORLOR_APP,
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: CORLOR_WHITE,
                    color: CORLOR_APP,
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
        )}

        {enableSearch ? (
          <div
            className="boxInputSearching"
            style={{
              marginLeft: isMenuOpen ? "-100%" : "0",
              backgroundColor: CORLOR_WHITE,
            }}>
            <div className="iconSearchinng">
              <FiSearch />
            </div>
            <input
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              onKeyDown={searchProduct}
              type="text"
              placeholder="What are you looking for"
              className="formSearching"
            />
            <div
              style={{
                position: "absolute",
                right: 7,
                top: 7,
                transform: "traslate(50%, 50%)",
                height: "1.5em",
                width: "1.5em",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                backgroundColor: "#ddd",
                color: CORLOR_APP,
                cursor: "pointer",
                borderRadius: "50%",
              }}
              onClick={handleHideBoxSearch}>
              <MdOutlineClose />
            </div>
          </div>
        ) : (
          ""
        )}

        {!enableSearch ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <div className="btnSearchData" onClick={handleShowBoxSearch}>
              <SearchOutlined
                style={{ fontSize: "1.2em", color: CORLOR_WHITE }}
              />
            </div>
            &nbsp;
            <div className="openMenu-dropdown" onClick={handelTrackOrderNow}>
              <FileSearchOutlined
                style={{ fontSize: "1.2em", color: CORLOR_WHITE }}
              />
            </div>
            {/* <Dropdown>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <FileSearchOutlined
                    style={{ fontSize: "1.2em", color: CORLOR_WHITE }}
                  />
                </Space>
              </a>
            </Dropdown> */}
            &nbsp;
            <div className="openMenu-dropdown" onClick={hadleCartProducts}>
              <Badge
                overflowCount={10}
                count={isNaN(totalQuantity) ? 0 : totalQuantity ?? 0}>
                <ShoppingCartOutlined
                  style={{ fontSize: "1.7em", color: CORLOR_WHITE }}
                />
              </Badge>
            </div>
            &nbsp; &nbsp;
            <div
              className="openMenu-dropdown"
              onClick={() => setOpenMyDrawer(true)}>
              <AlignRightOutlined
                style={{ fontSize: "1.2em", color: CORLOR_WHITE }}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* track order for me */}
      <div
        className="card-track-order-now"
        style={{ top: openTagTrack ? 0 : "-100%" }}>
        {/* <div
          style={{
            position: "absolute",
            right: 7,
            top: 7,
            transform: "traslate(50%, 50%)",
            height: "1.5em",
            width: "1.5em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
            backgroundColor: "#ddd",
            color: CORLOR_APP,
            cursor: "pointer",
            borderRadius: "50%",
          }}
          onClick={() => setOpenTagTrack(false)}>
          <MdOutlineClose />
        </div> */}

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
        open={openMyDrawer}>
        <ul onClick={oncloseDrawer} className="menu-drawer">
          <li onClick={() => navigate.push("/policy")}>
            <SafetyOutlined style={{ fontSize: 23 }} />
            <p>ນະໂຍບາຍການນຳໃຊ້</p>
          </li>

          <li onClick={() => handleIsStockThenZero()}>
            <QuestionCircleOutlined style={{ fontSize: 20, paddingLeft: 3 }} />
            <p>ວິທີການນຳໃຊ້ 4B Sale Page </p>
          </li>

          {/* <li
          // onClick={() => navigate.push("/ebook/Collapse4bShop")}
          >
            <ShopOutlined style={{ fontSize: 20, paddingLeft: 3 }} />
            <p>ວິທີສະໝັກ ເປີດຮ້ານ </p>
          </li> */}

          <li
            onClick={() => {
              window.open(LINK_AFFILIATE);
            }}>
            <UserSwitchOutlined style={{ fontSize: 20, paddingLeft: 3 }} />
            <p>ສະໝັກນຳໃຊ້ ອາຟຣີລີເອດ </p>
          </li>
        </ul>

        <Divider />
        <p style={{ width: "100%", textAlign: "center" }}>
          ປ້ອນເລກບິນ ເພື່ອກວດສອບອໍເດີ້ຂອງທ່ານ
        </p>
        <div>
          <Space.Compact
            style={{
              width: "100%",
            }}>
            <Input
              value={trackOrder}
              onChange={(e) => setTrackOrder(e?.target?.value)}
              status={CORLOR_APP}
              size="large"
              placeholder="ORDER-XXXXXX"
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
            }}>
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
