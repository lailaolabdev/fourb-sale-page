import { IoMdAdd, IoMdRemove } from "react-icons/io";

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
import { useRouter } from "next/router";
import { GET_EXCHANGRATE } from "../../apollo/exchanrage";
import {
  COLOR_TEXT,
  CORLOR_APP,
  numberFormat,
  S3_URL,
} from "../../helper";
import ModalConfirmComponent from "../../components/salePage/ModalConfirmComponent";
import EmptyImage from "../../components/salePage/EmptyImage";
import FooterComponent from "../../components/salePage/FooterComponent";
import { message } from "antd";
import CustomButton from "@/components/CustomButton";
import CustomNavbar from "@/components/CustomNavbar";
import Alert from 'react-bootstrap/Alert';
import { IoClose } from "react-icons/io5";
import { Button, Breadcrumb } from "react-bootstrap"
import { MdHome } from "react-icons/md";
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

  const dispatch = useDispatch();
  const { cartList } = useSelector((state) => state?.salepage);
  const { patchBack } = useSelector((state) => state?.setpatch);


  const [priceToPay, setPriceToPay] = useState();
  const [state, setState] = useState("idle");

  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);
  const [cartDatas, setCartDatas] = useState([]);
  const [shopInfo, setShopInfo] = useState()
  const handleCloseRemoveProduct = () => setShowConfirmRemove(false);
  const handleShowConfirmProduct = () => {
    setShowConfirmRemove(true);
  };

  const totalPrice = cartDatas.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // useEffect(()=> {
  //   let shopData = JSON.parse(localStorage.getItem("SP_SHOP_DATA"))
  //   console.log({shopData})

  // },[])


  useEffect(() => {
    if (patchBack?.id) {
      const _checkdatas = cartList.filter(
        (item) => item?.shop === patchBack?.id
      );
      setCartDatas(_checkdatas);
    }

    let shopData = JSON.parse(localStorage.getItem("SP_SHOP_DATA"))
    if(shopData) {
      console.log("cart------", shopData)
      setShopInfo(shopData?.shop)
    }
  }, [patchBack, cartList]);

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
    }, 1000);
  };


  const handleConfirmRemoveCart = () => {
    const patchkey = JSON.parse(localStorage.getItem("PATCH_KEY"));

    const checkBeforeRemove = cartDatas.map(
      (item) => item?.shop === patchkey?.id
    );
    // setCartDatas(checkBeforeRemove)
    if (checkBeforeRemove[0]) {
      dispatch(setOrders([]));
      dispatch(removeCartItem());
      setShowConfirmRemove(false);
    }

  };

  const onBackPage = () => {
      // Retrieve the state from local storage
      const idPreState = JSON.parse(localStorage.getItem("PATCH_KEY"));
  
      // Construct the destination path based on available data
      let destinationPath = `../shop/${idPreState?.id}`;
  
      if (idPreState?.affiliateId) {
        destinationPath += `?affiliateId=${idPreState.affiliateId}`;
        if (idPreState?.commissionForShopId) {
          destinationPath += `&commissionForShopId=${idPreState.commissionForShopId}`;
        }
      }
      router.replace(destinationPath);
  };

  return (
    <>
      <CustomNavbar shopDetail={shopInfo} />


      <div style={{ padding: "5px 0" }}>
        <div className="bread-crumb">
          <span onClick={onBackPage}><MdHome style={{fontSize:15}} /></span>
          <RxSlash />
          <span style={{cursor:'default'}}>ກະຕ່າສິນຄ້າ</span>
        </div>
      </div>

      {cartDatas?.length > 0 ? (
        <div className="p-4">
          <div className="w-100">
            {cartDatas?.map((data, index) => {
              return (
                <div key={data?.id} className="cartItem-product">
                  <div
                    className="remove-single-item"
                    onClick={() => dispatch(removeSingleItem(index))}
                  >
                    <IoClose
                      style={{ fontSize: 20, cursor: "pointer" }}
                    />
                  </div>

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
              <Button style={{ background: CORLOR_APP, width: '100%' }} onClick={handleConfirmCart} >ຈ່າຍເງິນ</Button>
              {/* <CustomButton
                type="submit"
                text="ສັ່ງຊື້"
                state={state}
                background={CORLOR_APP}
                onClick={handleConfirmCart}
                borderRadius={10}
                padding={8}
                width="100%"
              /> */}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '2em', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Alert style={{ width: "100%", textAlign: 'center' }} variant="warning">
            <small>ກະລຸນາເລືອກສິນຄ້າກ່ອນ!</small>
          </Alert>
          <img style={{ width: '100%', maxWidth: 400, height: '100%' }} src="https://test.techhut.com.bd/images/no-item-in-cart.gif" />
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
