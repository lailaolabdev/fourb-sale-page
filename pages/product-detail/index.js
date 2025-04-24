import CustomNavbar from "@/components/CustomNavbar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { IoBagAddSharp, IoCloseSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import {
  COMMISSION_OFFICE,
  S3_URL,
  S3_URL_MEDIUM,
  calculateRoundedValue,
  numberFormat,
} from "@/helper";
import Head from "next/head";

import { RxSlash } from "react-icons/rx";
import FooterComponent from "@/components/salePage/FooterComponent";
import { GET_STOCK, GET_STOCKS } from "@/apollo/stocks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { decode as base64Decode } from "js-base64";
import { useDispatch, useSelector } from "react-redux";
import {
  addCartItem,
} from "@/redux/salepage/cartReducer";
import { Toast } from "primereact/toast";
import { Fieldset } from "primereact/fieldset";
import { formatNumberFavorite } from "@/const";
import { GET_EXCHANGRATE } from "@/apollo/exchanrage";
import { GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE, SHOP } from "@/apollo";
import EmptyImage from "@/components/salePage/EmptyImage";

export default function index() {
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [stockAmount, setStockAmount] = useState(0);
  const toast = useRef(null);

  const [previewImage, setPreviewImage] = useState([]);
  const [defaultImage, setDefaultImage] = useState();
  const dispatch = useDispatch();
  const [shopDetail, setShopDetail] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [shopIdParams, setShopIdParams] = useState();
  const { patchBack } = useSelector((state) => state?.setpatch);
  const { cartList } = useSelector((state) => state?.salepage);

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "network-only" }
  );

  const [getShopData, { data: loadShopData }] = useLazyQuery(SHOP, {
    fetchPolicy: "network-only",
  });
  // const { detailProduct } = useQuery(GET_STOCK)

  const [
    getShopCommissionFor,
    { data: shopDataCommissionFor, loading: shopLoading },
  ] = useLazyQuery(GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE, {
    fetchPolicy: "network-only",
  });

  const {
    data: productDetail,
  } = useQuery(GET_STOCK, {
    fetchPolicy: "cache-and-network",
    variables: {
      where: {
        id: router.query.id,
      },
    },
  });


  useEffect(() => {
    if (productDetail) {
      setProduct(productDetail?.stock)
    }
  }, [productDetail]);

  useEffect(() => {
    if (router.query) {
      const queryKey = Object.keys(router.query)[0];

      if (queryKey) {
        // Split the query key by '_'
        const [shopId, name] = queryKey.split('_');
        setShopIdParams(shopId)
      }

      // localStorage.setItem("PATCH_KEY", JSON.stringify(router?.query));
      // dispatch(getKeyPatch(router?.query));


    }
  }, [router.query]);

  useEffect(() => {
    getExchangeRate({
      variables: {
        where: {
          shop: patchBack?.id,
        },
      },
    });
    getShopData({
      variables: {
        where: {
          id: patchBack?.id,
        },
      },
    });
    getShopCommissionFor({
      variables: {
        where: {
          id: patchBack?.commissionForShopId,
        },
      },
    });
  }, [patchBack]);

  useEffect(() => {
    if (loadShopData?.shop) {
      setShopDetail(loadShopData?.shop);
    }
  }, [loadShopData]);

  useEffect(() => {
    if (router.query.item) {
      try {
        const decodedItem = JSON.parse(base64Decode(router.query.item));
        setProduct(decodedItem);
      } catch (error) {
        setProduct(null);
      }
    }
  }, [router.query.item]);

  useEffect(() => {
    setPreviewImage(product?.image);
    if (product?.amount > 0) {
      setStockAmount(product?.amount - 1);
      setQuantity(1);
    } else {
      setQuantity(0);
      setStockAmount(0);
    }
  }, [product]);

  const _commissionForAffiliate =
    shopDataCommissionFor?.shopSettingCommissionInfluencer?.commission;

  const isExChangeRate = useMemo(() => {
    return loadExchangeRate?.exchangeRate;
  }, [loadExchangeRate?.exchangeRate]);

  const _calculatePriceWithExchangeRate = (price, currency, reduction) => {
    let idPreState = JSON.parse(localStorage.getItem("PATCH_KEY"));
    const { id, pid, influencer, commissionForShopId } = idPreState;
    let influencerId = influencer;
    let _price = 0;

    if (["BAHT", "ບາດ"].includes(currency)) {
      _price = price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      _price = price * (isExChangeRate?.usd || 0);
    } else {
      _price = price;
    }

    let priceProduct = 0;

    // ຄ່າຄອມມິດຊັ່ນ ສະເພາະຮ້ານ ກັບ ອິນຟູ ກຳນົດຕ່າງຫາກ
    if (patchBack?.commissionForShopId) {
      priceProduct = _price + (_price * _commissionForAffiliate) / 100;
    } else {
      priceProduct = _price;
    }

    if (shopDetail?.commissionService) {
      priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
    }

    // ຄ່າຄອມມິດຊັ່ນທີ່ຮ້ານເປີດໃຫ້ບໍລິການ ໃຫ້ ອິນຟູ
    if (influencerId && shopDetail?.commissionAffiliate) {
      priceProduct = priceProduct + (priceProduct * shopDetail?.commision) / 100;
    }

    // ຄຳນວນສ່ວນຫຼຸດ
    if (reduction > 0) {
      priceProduct = (priceProduct * reduction) / 100;
    }

    return calculateRoundedValue(priceProduct / 1000) * 1000;
  };



  const handleAddProduct = () => {
    let idPreState = JSON.parse(localStorage.getItem("PATCH_KEY"));
    const { id, pid, influencer, commissionForShopId } = idPreState;
    let influencerId = influencer;

    const existingProductIndex = cartList.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
      toast.current.show({
        severity: "info",
        summary: "ແຈ້ງເຕືອນ",
        detail: "ສິນຄ້ານີ້ເພິ່ມໃສ່ກະຕ່າແລ້ວ!",
      });
      return;
    }

    let _price = 0;

    if (["BAHT", "ບາດ"].includes(product?.currency)) {
      _price = product?.price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(product?.currency)) {
      _price = product?.price * (isExChangeRate?.usd || 0);
    } else {
      _price = product?.price;
    }

    let priceProduct = 0;

    // ຄ່າຄອມມິດຊັ່ນ ສະເພາະຮ້ານ ກັບ ອິນຟູ ກຳນົດຕ່າງຫາກ
    if (patchBack?.commissionForShopId) {
      priceProduct = _price + (_price * _commissionForAffiliate) / 100;
    } else {
      priceProduct = _price;
    }

    // ຄ່າບໍລິການຂອງລະບົບ
    if (shopDetail?.commissionService) {
      priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
    }

    // ຄ່າຄອມມິດຊັ່ນທີ່ຮ້ານເປີດໃຫ້ບໍລິການ ໃຫ້ ອິນຟູ
    if (influencerId && shopDetail?.commissionAffiliate) {
      priceProduct = priceProduct + (priceProduct * shopDetail?.commision) / 100;
    }

    if (product?.reduction !== null || product?.reduction) {
      priceProduct = (priceProduct * product?.reduction) / 100;
    }

    const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

    const { __typename, ...restData } = product;

    const _data = {
      ...restData,
      price: roundedValue || product?.price,
      shop: patchBack?.id,
    };

    if (quantity > 1) {
      _data = {
        ..._data,
        newQuantity: quantity,
      };
    }

    dispatch(addCartItem(_data));

    toast.current.show({
      severity: "success",
      summary: "ສຳເລັດ",
      detail: "ເພິ່ມສິນຄ້າເຂົ້າກະຕ່າຂອງທ່ານແລ້ວ",
    });
  };

  const incrementQuantity = () => {
    const newQuantity = stockAmount - 1;
    if (newQuantity < 0) {
      toast.current.show({
        severity: "error",
        summary: "ແຈ້ງເຕືອນ",
        detail: "ສິນຄ້າໃນສະຕ໋ອກບໍ່ພໍຂາຍ!",
      });
      return;
    }
    setStockAmount(newQuantity);
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    const newQuantity = stockAmount + 1;
    if (newQuantity < 0) {
      toast.current.show({
        severity: "error",
        summary: "ແຈ້ງເຕືອນ",
        detail: "ສິນຄ້າໃນສະຕ໋ອກບໍ່ພໍຂາຍ!",
      });
      return;
    }
    setStockAmount(newQuantity);
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  // click the menu home
  const onCalbackToHome = async () => {
    const idPreState = JSON.parse(localStorage.getItem("PATCH_KEY"));
    const { id, pid, influencer, commissionForShopId } = idPreState;

    let destinationPath = `../shop/${id}`;

    if (influencer) {
      destinationPath += `?influencer=${influencer}`;
      // if (commissionForShopId) {
      //   destinationPath += `&commissionForShopId=${commissionForShopId}`;
      // }
    }
    router.replace(destinationPath);
  };




  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <title>{product?.name}</title>
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="ລາຍລະອຽດສິນຄ້າຂາຍດີ"
        />
        {/* SEO image */}
        <link rel="icon" href={S3_URL + product?.image} type="image/icon type" />
        <meta charSet="UTF-8" />
        <meta property="og:image" content={S3_URL + product?.image} />
        <meta name="twitter:image" content={S3_URL + product?.image} />

      </Head>

      <Toast position="top-center" ref={toast} />
      <CustomNavbar />
      {/* <br />
       */}
      <div className="card-cart-products">
        <div className="bread-crumb">
          <span onClick={onCalbackToHome}>ໜ້າຫລັກ</span>
          <RxSlash />
          <span>{product?.name}</span>
        </div>
        <div className="card-view">
          <div className="card-dailog-image">
            <div className="image-view">
              {previewImage ? (
                <img
                  src={S3_URL_MEDIUM + previewImage}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <>
                  {product?.image ? (
                    <img
                      src={S3_URL_MEDIUM + product?.image}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <EmptyImage />
                  )}
                </>
              )}
            </div>
            {product?.containImages?.length > 0 && <div className="image-small-view">
              {product?.containImages?.map((data, index) => (
                <div
                  key={index}
                  style={{
                    background:
                      previewImage === data ? "rgba(47, 110, 163, 1)" : "#fff",
                  }}
                  onClick={(e) => setPreviewImage(data)}
                >
                  <img
                    style={{ width: "100%", height: "100%" }}
                    src={S3_URL + data}
                  />
                </div>
              ))}
            </div>}
          </div>
          <div className="card-dailog-content">
            <h3>{product?.name}</h3>
            {/* <p>Stocks: {product?.amount}</p> */}
            {product?.optionValues.length > 0 &&
              <>

                {product?.optionValues?.map(
                  (option, optionIndex) => (
                    <span key={optionIndex} style={{ fontSize: 11, }}>
                      {option?.value}{" "}
                    </span>
                  )
                )}
                <br />
                <br />
                <br />
              </>
            }

            <p>ສະຕ໋ອກ: {stockAmount}</p>
            {product?.reduction && (
              <p style={{ color: "red", fontSize: 23 }}>
                ສ່ວນຫຼຸດ {product?.reduction}%
              </p>
            )}
            <p>{product?.note ?? "..."}</p>

            <h4>
              {" "}
              ₭{" "}
              {product?.reduction && (
                <span
                  style={{
                    textDecoration: "line-through",
                  }}
                >
                  {numberFormat(product?.price)}
                </span>
              )}
              {/* {product?.reduction ? (
                <span>{numberFormat((product?.price * product?.reduction) / 100)}</span>
              ):(
                <span>{numberFormat((product?.price))}</span>
              )} */}
              <span>
                {numberFormat(
                  _calculatePriceWithExchangeRate(
                    product?.price ?? 0,
                    product?.currency,
                    product?.reduction
                  )
                )}
              </span>
            </h4>
            <br />
            {/* <p>Color:</p>
            <select>
              <option>red</option>
              <option>black</option>
              <option>green</option>
            </select>
            <p>Size:</p>
            <div className="size-moderm">
              <span>Small</span>
              <span>Midium</span>
              <span>Large</span>
            </div> */}

            <div className="card-button-preview"
            // style={{
            //   opacity: stockAmount <= 0 ? "0.5" : "1",
            // }}
            >
              <div>
                <p
                  onClick={() => {
                    if (quantity >= 2) {
                      decrementQuantity()
                    }
                  }}
                  style={{
                    cursor: quantity > 1 ? "pointer" : "not-allowed",
                    opacity: quantity > 1 ? "1" : "0.5"
                  }}
                >
                  <FaMinus />
                </p>
                <p style={{ userSelect: "none", opacity: quantity <= 0 ? "0.5" : "1" }}>{quantity}</p>
                <p
                  onClick={() => {
                    if (stockAmount > 0) {
                      incrementQuantity();
                    }
                  }}
                  style={{
                    cursor: stockAmount > 0 ? "pointer" : "not-allowed",
                    opacity: stockAmount <= 0 ? "0.5" : "1"
                  }}
                >
                  <FaPlus />
                </p>
              </div>
              <button disabled={quantity <= 0 ? true : false} onClick={handleAddProduct} style={{
                userSelect: "none",
                cursor: quantity >= 1 ? "pointer" : "not-allowed",
                opacity: quantity <= 0 ? "0.5" : "1"
              }}>
                <IoBagAddSharp />
                <span>ເພິ່ມກະຕ່າ</span>
              </button>
            </div>
            <br />
            <div style={{ cursor: "pointer" }}>
              <p>
                <FaRegHeart style={{ fontSize: 18 }} /> Favorite (
                {formatNumberFavorite(product?.favorite)})
              </p>
            </div>
          </div>
        </div>

        <div className="card-description-product">
          {product?.properties?.length > 0 && <div className="product-specifications">
            <h4>ຂໍ້ມູນ ຄຸນນະສົມບົດ ສິນຄ້າ</h4>
            {product?.properties?.map((item, index) => (
              <div key={index}>
                <li>{item?.title}</li>
                <li>{item?.detail}</li>
              </div>
            ))}
          </div>}
          {product?.descriptions?.length > 0 && <div className="product-specifications">
            <h4>ລາຍລະອຽດສິນຄ້າ</h4>

            {product?.descriptions?.map((item, index) => (
              <div
                style={{
                  flexDirection: "column",
                  gap: 10,
                  padding: "20px 0",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                key={index}
              >
                <p>{item?.title} </p>
                {item?.image && (
                  <img style={{ width: "70%" }} src={S3_URL + item?.image} />
                )}
              </div>
            ))}
          </div>}
        </div>
      </div>

      <FooterComponent />
    </>
  );
}
