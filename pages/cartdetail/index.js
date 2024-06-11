import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { BsCreditCard2BackFill } from "react-icons/bs";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RiDeleteBin6Line } from "react-icons/ri";
import {
  decrementCartItem,
  incrementCartItem,
  removeCartItem,
  removeSingleItem,
  updateCartItemQuantity,
} from "../../redux/salepage/cartReducer";
import { setOrders } from "../../redux/setOrder/orders";
import { useLazyQuery } from "@apollo/client";
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/router";
import { GET_EXCHANGRATE } from "../../apollo/exchanrage";
import ButtonComponent from "../../components/ButtonComponent";
import {
  calculateRoundedValue,
  CORLOR_APP,
  emptyImage,
  numberFormat,
  S3_URL,
} from "../../helper";
import ModalConfirmComponent from "../../components/salePage/ModalConfirmComponent";
import Image from "next/image";
import EmptyImage from "../../components/salePage/EmptyImage";
import FooterComponent from "../../components/salePage/FooterComponent";
import { CloseCircleOutlined } from "@ant-design/icons";
import { message } from "antd";
import CustomButton from "@/components/CustomButton";
import CustomNavbar from "@/components/CustomNavbar";
import { RxSlash } from "react-icons/rx";

export default function CartDetail() {
  const router = useRouter();

  // Retrieve the compareData from the query parameters
  const compareData = JSON.parse(router.query.compareData || "{}");

  // Access query parameters from the router
  const {
    liveId,
    live,
    affiliateId,
    id,
    shopForAffiliateId,
    commissionForShopId,
  } = router.query;
  const shopId = id;
  // console.log("affiliateId:--->", affiliateId)
  // console.log("shopId:--cart->", shopId)

  const dispatch = useDispatch();
  const [checkPaid, setCheckPaid] = React.useState(true);
  const { cartList } = useSelector((state) => state?.salepage);
  const { patchBack } = useSelector((state) => state?.setpatch);


  const [priceToPay, setPriceToPay] = useState();
  const [state, setState] = useState("idle");

  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);
  const [cartDatas, setCartDatas] = useState([]);
  const handleCloseRemoveProduct = () => setShowConfirmRemove(false);
  const handleShowConfirmProduct = () => {
    setShowConfirmRemove(true);
  };

  const totalPrice = cartDatas.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
 

  useEffect(() => {
    if (patchBack?.id) {
      const _checkdatas = cartList.filter(
        (item) => item?.shop === patchBack?.id
      );
      setCartDatas(_checkdatas);
      console.log("checkDtas:-------->", _checkdatas);
    }
  }, [patchBack, cartList]);

  console.log("cartList:---53to----->", cartList); 
  console.log("patchBack:---ຖຖto----->", patchBack); 

  const handleConfirmCart = () => {
    const combineField = {
      order: cartDatas,
      priceToPay: priceToPay,
    };
    setState("loading");
    let idPreState = {
      shopId: shopId,
      affiliateId: affiliateId,
    };

    if (commissionForShopId) {
      idPreState = {
        ...idPreState,
        commissionForShopId: commissionForShopId,
      };
    }

    const destinationPath =
      idPreState.shopId &&
      idPreState.affiliateId &&
      idPreState.commissionForShopId
        ? `/payment/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}&commissionForShopId=${idPreState.commissionForShopId}`
        : idPreState.shopId && idPreState.affiliateId
        ? `/payment/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}`
        : `/payment/${idPreState?.shopId}`;

    // send an HTTP request
    setTimeout(() => {
      setState("success");
      router.push("/payment");
      // dispatch(setOrders(combineField));
    }, 1000);
    // Navigate to the payment page with the query string
  };

  // const _calculatePriceWithExchangeRate = (price, currency) => {
  //   if (["BAHT", "ບາດ"].includes(currency)) {
  //     return price * isExChangeRate?.baht;
  //   } else if (["USD", "ໂດລາ"].includes(currency)) {
  //     // console.log("result:====>", price, isExChangeRate?.usd);
  //     return price * (isExChangeRate?.usd || 0);
  //   }

  //   return price;
  // };

  const handleConfirmRemoveCart = () => {
    const patchkey = JSON.parse(localStorage.getItem("PATCH_KEY"));
    console.log("patchkey:---->", { patchkey });

    const checkBeforeRemove = cartDatas.map(
      (item) => item?.shop === patchkey?.id
    );
    console.log("checkBeforeRemoveRemove:---->", checkBeforeRemove);
    // setCartDatas(checkBeforeRemove)
    if (checkBeforeRemove[0]) {
      dispatch(setOrders([]));
      dispatch(removeCartItem());
      setShowConfirmRemove(false);
    }

    // let idPreState = {
    //   shopId: shopId,
    //   affiliateId: affiliateId,
    // };

    // if (commissionForShopId) {
    //   idPreState = {
    //     ...idPreState,
    //     commissionForShopId: commissionForShopId,
    //   };
    // }

    // const destinationPath =
    // idPreState.shopId && idPreState.affiliateId &&
    // idPreState.commissionForShopId
    //   ? `../shop/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}&commissionForShopId=${idPreState.commissionForShopId}`
    //   : idPreState.shopId &&
    //     idPreState.affiliateId
    //   ? `../shop/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}`
    //   : `../shop/${idPreState?.shopId}`;

    // router.push(destinationPath);
  };

  const onBackPage = () => {
    let idPreState = {
      shopId: shopId,
      affiliateId: affiliateId,
    };

    if (commissionForShopId) {
      idPreState = {
        ...idPreState,
        commissionForShopId: commissionForShopId,
      };
    }

    const destinationPath =
      idPreState.shopId &&
      idPreState.affiliateId &&
      idPreState.commissionForShopId
        ? `../shop/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}&commissionForShopId=${idPreState.commissionForShopId}`
        : idPreState.shopId && idPreState.affiliateId
        ? `../shop/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}`
        : `../shop/${idPreState?.shopId}`;

    // router.push(destinationPath);
  };

  return (
    <>
      <CustomNavbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1em",
        }}
      >
        {/* <div className="bread-crumb">
          <span onClick={() => router.back()}>shop</span>
          <RxSlash />
          <span>ກະຕ່າສິນຄ້າ</span>
        </div> */}
        {/* <div className="removeIcon1" onClick={onBackPage}>
          <MdArrowBack style={{ fontSize: 20 }} />
        </div> */}
        {/* <div>
          <h4 style={{ marginTop: ".4em" }}>ກະຕ່າສິນຄ້າ</h4>
        </div>
        <div></div> */}
      </div>
      {cartDatas?.length > 0 ? (
        <div className="p-4">
          <div className="w-100">
            {cartDatas?.map((data, index) => {
              return (
                <div key={data?.id} className="cartItem-product">
                  {/* <div
                    className="remove-single-item"
                    onClick={() => dispatch(removeSingleItem(index))}
                  >
                    <CloseCircleOutlined
                      style={{ fontSize: 20, cursor: "pointer" }}
                    />
                  </div> */}

                  <div className="cartImage">
                    {data?.image?.length > 0 ? (
                      <img src={S3_URL + data?.image} alt="productImage" />
                    ) : (
                      <EmptyImage />
                    )}
                  </div>
                  <div className="action-item">
                    <h5>
                      {index + 1}. {data?.name}
                    </h5>
                    <div className="amounts-and-qty">
                      <h6>{numberFormat(data?.price)} ກີບ</h6>
                      <h6>
                        {isNaN(data?.price * data?.qty)
                          ? 0
                          : numberFormat(data?.price * data?.qty)}{" "}
                        ກີບ
                      </h6>
                    </div>

                    <div className="action-button">
                      {data?.qty >= 2 ? (
                        <div
                          className="decrement"
                          onClick={() => dispatch(decrementCartItem(index))}
                        >
                          <IoMdRemove />
                        </div>
                      ) : (
                        <div className="decrement">
                          <IoMdRemove />
                        </div>
                      )}

                      <input
                        type="number"
                        className="amount-product"
                        value={data?.qty}
                        onChange={(e) => {
                          const newQty = parseInt(e?.target?.value);
                          if (data?.qty >= data?.amount) {
                            message.error("ຈຳນວນທີຊື້ຫຼາຍກວ່າໃນສະຕ໋ອກແລ້ວ");
                            return;
                          }
                          dispatch(
                            updateCartItemQuantity({
                              index,
                              newQuantity: newQty,
                            })
                          );
                        }}
                      />
                      <div
                        className="increment"
                        onClick={() => {
                          if (data?.qty >= data?.amount) {
                            message.error("ຈຳນວນທີຊື້ຫຼາຍກວ່າໃນສະຕ໋ອກແລ້ວ");
                            return;
                          }
                          dispatch(incrementCartItem(index));
                        }}
                      >
                        <IoMdAdd />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="removeCart">
              <div></div>
              <div
                className="removeIcon2"
                onClick={() => handleShowConfirmProduct()}
              >
                <RiDeleteBin6Line style={{ fontSize: 20 }} />{" "}
                &nbsp;ຍົກເລີກສິນຄ້າທັງໝົດ
              </div>
            </div>
          </div>

          <div className="action-cart-product-footer">
            <div className="action-price-amounts">
              <h5>ຈຳນວນສິນຄ້າທັງໝົດ:</h5>
              <h5>{cartDatas?.length} ລາຍການ</h5>
            </div>
            <br />
            <div className="action-price-amounts">
              <h5>ເງິນລວມທີ່ຕ້ອງຈ່າຍ:</h5>
              <h5>{isNaN(totalPrice) ? 0 : numberFormat(totalPrice)} ກີບ</h5>
            </div>
            <div className="paid-buy">
              <CustomButton
                type="submit"
                text="ສັ່ງຊື້"
                state={state}
                background={CORLOR_APP}
                onClick={handleConfirmCart}
                borderRadius={10}
                padding={8}
                width="100%"
              />
            </div>
          </div>
        </div>
      ) : (
       <div style={{padding:'5em', overflow:'hidden',display:'flex',justifyContent:'center',alignItems:'center'}}>
         <img style={{width:'100%', maxWidth:500, height:'100%'}} src="https://i.pinimg.com/originals/5a/d0/47/5ad047a18772cf0488a908d98942f9bf.gif" />
       </div>
      )}

      <ModalConfirmComponent
        showConfirmModal={showConfirmRemove}
        handleCancel={handleCloseRemoveProduct}
        handleConfirm={handleConfirmRemoveCart}
        title="ແຈ້ງເຕືອນ"
        text="ສິນຄ້າຢູ່ໃນກະຕ່າຂອງທ່ານຈະຖຶກລົບອອກທັງໝົດ?"
      />

      <FooterComponent />
    </>
  );
}
