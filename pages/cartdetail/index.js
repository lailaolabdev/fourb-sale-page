import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { BsCreditCard2BackFill } from "react-icons/bs";

import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RiDeleteBin6Line } from "react-icons/ri";
import {
  decrementCartItem,
  incrementCartItem,
  removeCartItem,
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
  emptyImage,
  numberFormat,
  S3_URL,
} from "../../helper";
import ModalConfirmComponent from "../../components/salePage/ModalConfirmComponent";
import Image from "next/image";
import EmptyImage from "../../components/salePage/EmptyImage";
import FooterComponent from "../../components/salePage/FooterComponent";

export default function CartDetail() {
  // const { match, location } = useReactRouter();
  // const { shopId, live, affiliateId } = match?.params;
  // const { commision } = router.query;

  const router = useRouter();

  // Retrieve the compareData from the query parameters
  const compareData = JSON.parse(router.query.compareData || "{}");

  // Access the commision property from compareData
  // const commision = compareData.commision || 'Default Commision';

  //  const router = useRouter();

  // Access query parameters from the router
  const { shopId, affiliateId } = router.query;
  // console.log("affiliateId:--->", affiliateId)

  const dispatch = useDispatch();
  const [checkPaid, setCheckPaid] = React.useState(true);
  const { cartList } = useSelector((state) => state?.salepage);
  const [priceToPay, setPriceToPay] = useState();

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "cache-and-network" }
  );

  //   fetch exchange ret
  useEffect(() => {
    getExchangeRate({
      variables: {
        where: {
          shop: shopId,
        },
      },
    });
  }, [shopId]);

  const isExChangeRate = useMemo(() => {
    return loadExchangeRate?.exchangeRate;
  }, [loadExchangeRate?.exchangeRate]);

  // ຄຳນວນຈຳນວນເງິນຈາມສະກຸນເງິນ
  const calculatorAll = useMemo(() => {
    // let totalLak = 0;
    // let totalBaht = 0;
    // let totalUsd = 0;
    let amountKip = 0;

    // ກວດສອບສະກຸນເງິນກ່ອນຄຳນວນ
    for (let order of cartList) {
      const { currency, qty, price } = order;

      const sumpriceRecord = (amountKip += qty * price);
      setPriceToPay(sumpriceRecord);

      //  console.log("roundedValue4444---------------->", sumpriceRecord)

      // console.log("777 new:",amountKip += qty * price)

      // if (currency === "LAK" || currency === "ກີບ") {
      //   totalLak += qty * price;
      // } else if (currency === "BAHT" || currency === "ບາດ") {
      //   totalBaht += qty * price;
      // } else if (currency === "USD" || currency === "ໂດລາ") {
      //   totalUsd += qty * price;
      // } else {
      //   totalLak += qty * price;
      // }
    }

    // ຄິດໄລ່ຈຳນວນເງິນທັງໝົດເປັນເງິນກີບ ໂດຍໃຊ້ອັດຕາແລກປ່ຽນ ຖ້າມີ
    // amountKip =
    //   totalLak +
    //     totalBaht * isExChangeRate?.baht +
    //     totalUsd * isExChangeRate?.usd || totalLak;

    //     const roundedValue = calculateRoundedValue(amountKip/1000)*1000;

    return {
      // totalLak,
      // totalBaht,
      // totalUsd,
      amountKip,
      // sumpriceRecord,
      // roundedValue,
      // priceAqllPaid
      // modelType: "",
      // shop: shopId,
    };
  }, [cartList, isExChangeRate]);

  // console.log("roundedValue---------------->", calculatorAll?.roundedValue)
  // console.log("roundedValue5555---------------->", calculatorAll?.amountKip)

  const handleCheckPaid = () => {
    setCheckPaid(!checkPaid);
  };

  const handleConfirmCart = () => {
    const combineField = {
      order: cartList,
      // orderGroup: calculatorAll?.sumpriceRecord,
      // orderGroup: priceToPay,
      priceToPay: priceToPay,
    };
    console.log("orderGroups---->", calculatorAll)
    console.log("orderGroups---66->", priceToPay)
    dispatch(setOrders(combineField));
    // const destinationPath = affiliateId
    //   ? "/payment/" + shopId + "/" + affiliateId
    //   : "/payment/" + shopId;

  // Navigate to the payment page with the query string
  router.push("/payment")
  }; 

  // console.log("cartList---->", cartList);
  const [showConfirmRemove, setShowConfirmRemove] = React.useState(false);

  const handleCloseRemoveProduct = () => setShowConfirmRemove(false);
  const handleShowConfirmProduct = () => {
    setShowConfirmRemove(true);
  };

  const _calculatePriceWithExchangeRate = (price, currency) => {
    if (["BAHT", "ບາດ"].includes(currency)) {
      return price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      // console.log("result:====>", price, isExChangeRate?.usd);
      return price * (isExChangeRate?.usd || 0);
    }

    return price;
  };

  const handleConfirmRemoveCart = () => {
    dispatch(removeCartItem());
    dispatch(setOrders([]));
    setShowConfirmRemove(false);
    router.back();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1em",
        }}>
        <div className="removeIcon1" onClick={() => router.back()}>
          <MdArrowBack style={{ fontSize: 20 }} />
        </div>
        <div>
          <h4 style={{ marginTop: ".4em" }}>ກະຕ່າສິນຄ້າ</h4>
        </div>
        <div></div>
      </div>
      <div className="containerCartItems">
        <div className="w-100">
          {cartList?.map((data, index) => {
            return (
              <div key={data?.id} className="cartItem-product">
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
                    <h6>{numberFormat(data?.price * data?.qty)} ກີບ</h6>
                  </div>

                  <div className="action-button">
                    <div
                      className="decrement"
                      onClick={() => dispatch(decrementCartItem(index))}>
                      <IoMdRemove />
                    </div>
                    <input
                      type="number"
                      className="amount-product"
                      value={data?.qty}
                      onChange={(e) => {
                        const newQty = parseInt(e?.target?.value);
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
                      onClick={() => dispatch(incrementCartItem(index))}>
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
              onClick={() => handleShowConfirmProduct()}>
              <RiDeleteBin6Line style={{ fontSize: 20 }} />{" "}
              &nbsp;ຍົກເລີກສິນຄ້າທັງໝົດ
            </div>
          </div>
        </div>

        <div className="action-cart-product-footer">
          <div className="action-price-amounts">
            <h5>ຈຳນວນສິນຄ້າທັງໝົດ:</h5>
            <h5>{cartList?.length} ລາຍການ</h5>
          </div>
          <br />
          <div className="action-price-amounts">
            <h5>ເງິນລວມທີ່ຕ້ອງຈ່າຍ:</h5>
            <h5>{isNaN(priceToPay) ? 0 : numberFormat(priceToPay)} ກີບ</h5>
          </div>
          <div className="paid-buy">
            <ButtonComponent
              backgroundColor="#3c169b"
              hoverBackgroundColor="#3c169b"
              cursor={checkPaid ? "no-drop" : "pointer"}
              textColor="#fff"
              text="ສັ່ງຊື້"
              fontSize="1.2em"
              fontWeight={500}
              // disabled={checkPaid}
              width="100%"
              padding="15px"
              onClick={handleConfirmCart}
              icon={<BsCreditCard2BackFill style={{ fontSize: 27 }} />}
            />
          </div>
        </div>
      </div>

      <ModalConfirmComponent
        showConfirmModal={showConfirmRemove}
        handleCancel={handleCloseRemoveProduct}
        handleConfirm={handleConfirmRemoveCart}
        title="ແຈ້ງເຕືອນ"
        text="ຕ້ອງການລົບສິນຄ້າອອກຈາກກະຕ່າທັງໝົດບໍ່?"
      />

      <FooterComponent />
    </>
  );
}
