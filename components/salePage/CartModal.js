import React, { useEffect, useMemo } from "react";
// import { Modal } from "react-bootstrap";
import { BsCartCheckFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import ProductDetail from "./ProductDetail";
import { Image, Modal } from "antd";
import { S3_URL, calculateRoundedValue, emptyImage, numberFormat } from "../../helper";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { GET_EXCHANGRATE } from "../../apollo/exchanrage";
import { useLazyQuery } from "@apollo/client";
import { GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE } from "../../apollo";
import { useRouter } from "next/router";
import { IoMdAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import { addCartItem } from "../../redux/salepage/cartReducer";

function CartModal(props) {
  const productView = props?.viewProduct;
  const isModalOpen = props?.show;
  const { handleCloseModals } = props;
  const shopDetail = props?.shopDetail;
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();

  // console.log("productView------see>", productView)

  const router = useRouter();
  
  const handleAddProduct = (stateView) => {
    if (stateView?.amount <= 0) {
      toast.warning("ສິນຄ້ານີ້ບໍ່ພໍຂາຍ!", {
        autoClose: 800,
      });
    } else {
      dispatch(addCartItem(stateView));
      // toast.success("ເພິ່ມເຂົ້າກະຕ່າສຳເລັດແລ້ວ", {
      //   autoClose: 700,
      // });
      handleCloseModals();
    }
  };

  return (
    <Modal
      title={"ລາຍລະອຽດສິນຄ້າ"}
      open={isModalOpen}
      onOk={"new"}
      footer={null}
      onCancel={handleCloseModals} width={1000}>
      <div
        style={{
          display: "flex",
          flexDirection: width > 700 ? "row" : "column", gap: 20
        }}>
        <Image
          src={
            productView?.image?.length > 0
              ? S3_URL + productView?.image
              : emptyImage
          }
          width={width > 700 ? '40%': "100%"}
          height={"20em"}
          />
        <div
          style={{
            width: width > 700 ? '50em': "100%",
            display: "flex",
            marginTop: "1em",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",

          }}>
          <h4>{productView?.name ?? "....."}</h4>
          <p>{productView?.note ?? "....."}</p>
          <div className="amount-qty-size">
            <div className="boxShowAction">
              <p>ຈຳນວນເຫຼືອ</p>
              <div className="boxdisplay">
                {numberFormat(productView?.amount ?? 0)} {productView?.unit}
              </div>
            </div>
            <div className="boxShowAction">
              <p>ລາຄາສິນຄ້າ</p>
              <div className="boxdisplay"> 
                {numberFormat(
                    productView?.price ?? 0
                )}{" "}
                ກີບ
              </div>
            </div>
            <div className="boxShowAction">
              <p>ເພິ່ມກະຕ່າ</p>
              <div className="boxdisplay-button">
                <div
                  className="incrementView"
                  onClick={() => handleAddProduct(productView)}>
                  <IoMdAdd style={{ fontSize: 28 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CartModal;
