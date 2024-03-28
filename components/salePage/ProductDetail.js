import { useDispatch } from "react-redux";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
// import { toast } from "react-toastify";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import React, { useEffect, useMemo, useState } from "react";
// import emptyImage from "../../image/salePageImg/emptyImage.jpg";
// import { addCartItem } from "../../redux/salepage/cartReducer";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useLazyQuery } from "@apollo/client";
import { GET_EXCHANGRATE } from "../../apollo/exchanrage";
import { useRouter } from "next/router";
import ButtonComponent from "../ButtonComponent";
import { calculateRoundedValue, emptyImage, numberFormat } from "../../helper";
import { COMMISSION_OFFICE, S3_URL } from "../../helper";
import { addCartItem } from "../../redux/salepage/cartReducer";
import { GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE } from "../../apollo";
import { Image } from "antd";
import EmptyImage from "./EmptyImage";

export default function ProductDetail(props) {
  const router = useRouter();
  const { id } = router.query;
  // const shopId = id;
  const shopDetail = props?.shopDetail;

  const { liveId, shopId, live, influencerId, shopForAffiliateId } =
    router.query;

  const stateView = props?.data;
  const { onClose } = props;
  const dispatch = useDispatch();
  const [rotationAngle, setRotationAngle] = useState(0);
  //   const { match } = useReactRouter();

  //   const { shopId } = match?.params;

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "cache-and-network" }
  );

  const [
    getShopCommissionFor,
    { data: shopDataCommissionFor, loading: shopLoading },
  ] = useLazyQuery(GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    getShopCommissionFor({
      variables: {
        where: {
          id: shopForAffiliateId,
        },
      },
    });
  }, [shopForAffiliateId]);

  // ຕົວປ່ຽນຄ່າຄອມມິດຊັ່ນທີ່ຮ້ານ ກຳນົດໃຫ້ ອາຟຣິລີເອດ
  const _commissionForAffiliate =
    shopDataCommissionFor?.shopSettingCommissionInfluencer?.commission;

  const isExChangeRate = useMemo(() => {
    return loadExchangeRate?.exchangeRate;
  }, [loadExchangeRate?.exchangeRate]);

  const rotateImageMinute = () => {
    setRotationAngle(rotationAngle - 45);
  };
  const rotateImagePlus = () => {
    setRotationAngle(rotationAngle + 45);
  };

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
      onClose();
    }
  };

  useEffect(() => {
    getExchangeRate({
      variables: {
        where: {
          shop: shopId,
        },
      },
    });
  }, [shopId]);

  const _calculatePriceWithExchangeRate = (price, currency) => {
    // console.log("currency import------->", currency)
    // console.log("price import------->", price)

    let _price = 0;

    if (["BAHT", "ບາດ"].includes(currency)) {
      _price = price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      _price = price * (isExChangeRate?.usd || 0);
    } else {
      _price = price;
    }

    // console.log("_price out------->", _price)

    let priceProduct = 0;
    const commissionRate = (shopDetail?.commision ?? 0) / 100; // commission affiliate default
    const _commissioinForInflu = (_commissionForAffiliate ?? 0) / 100; // commission shop as an affiliate
    const baseCommission = shopDetail?.commissionService
      ? _price * COMMISSION_OFFICE
      : 0; // percent service for Lailaolab

    if (shopDetail?.commissionAffiliate && !shopDetail?.commissionService) {
      priceProduct = _price + _price * commissionRate;
    } else if (
      shopDetail?.commissionService &&
      shopDetail?.commissionAffiliate
    ) {
      const affiliateCommission =
        shopForAffiliateId !== undefined
          ? _price * _commissioinForInflu
          : _price * commissionRate;
      priceProduct = _price + affiliateCommission + baseCommission;
    } else {
      priceProduct = _price + baseCommission;
    }

    // priceProduct = Math.round(priceProduct / 1000) * 1000;
    const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

    return roundedValue;
  };

  return (
    <>
      <div className="product-view-new">
        <div className="viewImage">
          {stateView?.image?.length > 0 ? (
            <Image
              src={S3_URL + stateView?.image}
              layout="fill"
              alt="emptyImage"
              width={"100%"}
              height={"100%"}
            />
          ) : (
            <EmptyImage />
          )}
        </div>
        <div className="viewDescription">
          <h3>{stateView?.name}</h3>
          {/* <h5>ລະຫັດ CF: {stateView?.cfMessage}</h5> */}
          <p>{stateView?.note ?? "..............."}</p>

          <div className="amount-qty-size">
            <div className="boxShowAction">
              <p>ຈຳນວນເຫຼືອ</p>
              <div className="boxdisplay">
                {numberFormat(stateView?.amount ?? 0)} {stateView?.unit}
              </div>
            </div>
            <div className="boxShowAction">
              <p>ລາຄາສິນຄ້າ</p>
              <div className="boxdisplay">
                {numberFormat(
                  _calculatePriceWithExchangeRate(
                    stateView?.price ?? 0,
                    stateView?.currency
                  )
                )}{" "}
                ກີບ
              </div>
            </div>
            <div className="boxShowAction">
              <p>ເພິ່ມກະຕ່າ</p>
              <div className="boxdisplay">
                <div
                  className="incrementView"
                  onClick={() => handleAddProduct(stateView)}>
                  <IoMdAdd style={{ fontSize: 28 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Button variant="outline-secondary" className="btnBottclose" onClick={() => onClose()}>
          ປິດໜ້າຕ່າງ
        </Button> */}
      </div>
    </>
  );
}
