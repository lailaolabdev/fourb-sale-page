import React from "react";

// import { S3_URL } from "../../helper";
// import emptyProfile from "../../images/emptyProfile.jpg";
import { FiSearch } from "react-icons/fi";
import { HiMenuAlt1 } from "react-icons/hi";
import {  
  MdDns,
  MdOutlineClose,
  MdScreenSearchDesktop,  
  MdTurnedIn,
} from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsCartCheckFill } from "react-icons/bs";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { S3_URL } from "../../helper";
import { Avatar } from "@mui/material";

function HeaderSalePage({
  enableSearch,
  handleShowProfile,
  loadShopData,
  setFilter,
  filter,
  searchProduct,
  handleShowBoxSearch,
  handleHideBoxSearch,
  handleSearchOrder,
  isMenuOpen,
  toggleMenu,
  ButtonStyleFilter,
  isInStock,
  handleIsStockZero,
  handleIsStockThenZero,
  cartList,
  hadleCartProducts,
}) {
  const { height, width } = useWindowDimensions();

  let totalQuantity = 0;
  for (let item of cartList) {
    totalQuantity += item?.qty;
  }

  // console.log("loadShopData?.shop?.name-->", loadShopData?.shop?.name);

  return (
    <div>
      <div className="headerSalePage">
        {!enableSearch && (
          <div className="shopProfile">
            <div className="imgShop" onClick={handleShowProfile}>
              {/* <FiSearch /> */}
              <Avatar
                alt={loadShopData?.shop?.name}
                src={S3_URL + loadShopData?.shop?.image}
                sx={{ width: 56, height: 56 }}
              /> 
            </div>
            &nbsp;
            {width > 370 && (
              <div className="shopName">
                <span>{loadShopData?.shop?.name}</span>

                <span style={{ fontSize: "13px" }}>
                  020 {loadShopData?.shop?.phone ?? "-"}
                </span>
              </div>
            )}
          </div>
        )}

        {enableSearch ? (
          <div
            className="boxInputSearching"
            style={{ marginLeft: isMenuOpen ? "-100%" : "0" }}>
            <div className="iconSearchinng">
              <FiSearch />
            </div>
            <input
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              onKeyDown={searchProduct}
              type="text"
              placeholder="ປ້ອນຊື່ສິນຄ້າ ແລ້ວກົດ Enter"
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
              <FiSearch />
            </div>
            &nbsp; &nbsp;
            {width < 700 && (
              <div
                className="openMenu-dropdown"
                style={{ position: "relative" }}
                onClick={hadleCartProducts}>
                <BsCartCheckFill style={{ fontSize: "1.4em" }} />
                {cartList?.length > 0 ? (
                  <span
                    style={{
                      position: "absolute",
                      top: "-.5em",
                      right: 0,
                      width: "1.5em",
                      padding: ".3em",
                      height: "1.5em",
                      borderRadius: "50rem",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "red",
                      color: "white",
                      fontSize: ".8em",
                    }}>
                    {isNaN(totalQuantity) ? 0 : totalQuantity ?? 0}
                  </span>
                ) : (
                  ""
                )}
              </div>
            )}
            &nbsp; &nbsp;
            <div className="openMenu-dropdown" onClick={toggleMenu}>
              <BiDotsVerticalRounded style={{ fontSize: "1.4em" }} />
            </div>
            <div
              style={{ marginTop: !isMenuOpen ? "-100%" : "0" }}
              className="dropdown-content-actions">
              <button
                type="button"
                style={{
                  ...ButtonStyleFilter,
                  color: isInStock === 0 ? "#ffffff" : "gray",
                  backgroundColor: isInStock === 0 ? "#3c169b" : "#eeeeee",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  padding: "1em .5em",
                }}
                onClick={() => handleIsStockZero()}>
                <MdDns style={{ fontSize: 25 }} />
                <span>ທັງໝົດ</span>
              </button>
              <button
                style={{
                  ...ButtonStyleFilter,
                  color: isInStock === 1 ? "#ffffff" : "gray",
                  backgroundColor: isInStock === 1 ? "#3c169b" : "#eeeeee",
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  padding: "1em .5em",
                }}
                onClick={() => handleIsStockThenZero()}>
                <MdTurnedIn style={{ fontSize: 25 }} />
                <span>ສິນຄ້າຍັງເຫຼືອ</span>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default HeaderSalePage;
