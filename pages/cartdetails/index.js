import CustomNavbar from "@/components/CustomNavbar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { IoBagAddSharp, IoCloseSharp } from "react-icons/io5";
import { useRouter } from "next/router";
import { COMMISSION_OFFICE, S3_URL, S3_URL_MEDIUM, calculateRoundedValue, numberFormat } from "@/helper";
import { HiHome } from "react-icons/hi2";
import { SiShopee } from "react-icons/si";
import { RxSlash } from "react-icons/rx";
import FooterComponent from "@/components/salePage/FooterComponent";
import { GET_STOCK, GET_STOCKS } from "@/apollo/stocks";
import { useLazyQuery } from "@apollo/client";
import { decode as base64Decode } from "js-base64";
import { useDispatch, useSelector } from "react-redux";
import {
  addCartItem,
  decrementCartItem,
  incrementCartItem,
} from "@/redux/salepage/cartReducer";
import { Toast } from "primereact/toast";
import { Fieldset } from "primereact/fieldset";
import { formatNumberFavorite } from "@/const";
import { GET_EXCHANGRATE } from "@/apollo/exchanrage";
import { SHOP } from "@/apollo";

const images = [
  {
    name: "https://media.istockphoto.com/id/1332092432/photo/magnifying-glass-focusing-a-forest.jpg?s=612x612&w=0&k=20&c=BMTiQfV-Mp6MMg-MGYCqbu9kWOsX5Rq6vw3UvXao-m8=",
  },
  {
    name: "https://images.unsplash.com/photo-1549655698-c7a8a4639ec8?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xlYXJ8ZW58MHx8MHx8fDA%3D",
  },
  {
    name: "https://media.istockphoto.com/id/968167380/photo/glass-ball-in-hand.jpg?s=612x612&w=0&k=20&c=Nu9irojC_nH8RmzAn1bM9y1p-I2TfWhoWkMHlK9qn-Y=",
  },
  {
    name: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK1Uu9sGTIac4rc8IGXwW6ygWNNSm9FrxeXrY58d4Fjr6xjOA9CcliPZEkxpHu-y8lmKY&usqp=CAU",
  },
  {
    name: "https://assets.unileversolutions.com/v1/123147056.jpg",
  },
  {
    name: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSU7xftKz0jfgObmFvvQ3_ONQxg4JpH3Sa4zU8ikiPj2prrzxdt3cVBmwZacTCovLIeEMo&usqp=CAU",
  },
  {
    name: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq6wkLE4Q3kiizMDVOBGOS5Efkf9L1muq_eKRP0F9EGq083-9-euaJgfnzv6a1eymaK9U&usqp=CAU",
  },
];

export default function index() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const toast = useRef(null);

  const [previewImage, setPreviewImage] = useState([]);
  const [defaultImage, setDefaultImage] = useState();
  const dispatch = useDispatch();
  const [shopDetail, setShopDetail] = useState("");

  const [quantity, setQuantity] = useState(1);
  const { patchBack } = useSelector((state) => state?.setpatch);

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "network-only" }
  );

  const [getShopData, { data: loadShopData }] = useLazyQuery(SHOP, {
    fetchPolicy: "network-only",
  });

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
  },[patchBack])

  useEffect(() => {
    if (loadShopData?.shop) {
      setShopDetail(loadShopData?.shop);
    }
  }, [loadShopData]);

  useEffect(() => {
    if (router.query.item) {
      try {
        console.log({ router });
        const decodedItem = JSON.parse(base64Decode(router.query.item));
        setProduct(decodedItem);
      } catch (error) {
        console.error("Failed to decode item data:", error);
        setProduct(null); // Or handle the error appropriately
      }
    }
  }, [router.query.item]);

  

  useEffect(() => {
    if (product?.containImages) {
      setPreviewImage(product?.containImages[0]);
    }
  }, [product?.containImages]);

  const isExChangeRate = useMemo(() => {
    return loadExchangeRate?.exchangeRate;
  }, [loadExchangeRate?.exchangeRate]);

  const _calculatePriceWithExchangeRate = (price, currency, reduction) => {
    let _price = 0;

    if (["BAHT", "ບາດ"].includes(currency)) {
      _price = price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      _price = price * (isExChangeRate?.usd || 0);
    } else {
      _price = price;
    }

    let priceProduct = 0;

    if (patchBack?.commissionForShopId) {
      priceProduct = _price + (_price * _commissionForAffiliate) / 100;
    } else {
      priceProduct = _price;
    }

    if (shopDetail?.commissionService) {
      priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
    } else {
      priceProduct = _price;
    }

    // ຄຳນວນສ່ວນຫຼຸດ
    if (reduction > 0) {
      priceProduct = (priceProduct * reduction) / 100;
    }

    return calculateRoundedValue(priceProduct / 1000) * 1000;
  };

  // add product to cart
  const onAddToCart = () => {
    let productWithQuantity = {};

    // Calculate the new price based on the reduction percentage
    const reduction = product.reduction ?? 0;
    const newPrice = product.price - (product.price * reduction) / 100;

    if (quantity > 1) {
      productWithQuantity = {
        ...product,
        shop: patchBack?.id,
        newQuantity: quantity,
      };
      // Only update the price if there is a reduction
      if (product.reduction) {
        productWithQuantity.price = newPrice;
      }
    } else {
      productWithQuantity = {
        ...product,
        shop: patchBack?.id,
      };
      // Only update the price if there is a reduction
      if (product.reduction) {
        productWithQuantity.price = newPrice;
      }
    }

    console.log("productWithQuantity:::", productWithQuantity);

    // dispatch(addCartItem(productWithQuantity));
    // toast.current.show({
    //   severity: "success",
    //   summary: "ສຳເລັດ",
    //   detail: "ເພິ່ມສິນຄ້າເຂົ້າກະຕ່າຂອງທ່ານແລ້ວ",
    // });
  };

  const handleAddProduct = () => {
    
      let _price = 0;

      if (["BAHT", "ບາດ"].includes(product?.currency)) {
        _price = product?.price * isExChangeRate?.baht;
      } else if (["USD", "ໂດລາ"].includes(product?.currency)) {
        _price = product?.price * (isExChangeRate?.usd || 0);
      } else {
        _price = product?.price;
      }

      let priceProduct = 0;

      if (patchBack?.commissionForShopId) {
        priceProduct = _price + (_price * _commissionForAffiliate) / 100;
      } else {
        priceProduct = _price;
      }

      if (shopDetail?.commissionService) {
        priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
      } else {
        priceProduct = _price;
      }

      if (product?.reduction !== null || product?.reduction) {
        priceProduct = (priceProduct * product?.reduction) / 100;
      }

      const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

      // const _data = {
      //   ...data,
      //   price: roundedValue,
      //   modelType: live, shop: shopId
      // };

      // console.log({_data})

      const { __typename, ...restData } = product;

      const _data = {
        ...restData,
        price: roundedValue,
        shop: patchBack?.id,
      };


      dispatch(addCartItem(_data));

      toast.current.show({
        severity: "success",
        summary: "ສຳເລັດ",
        detail: "ເພິ່ມສິນຄ້າເຂົ້າກະຕ່າຂອງທ່ານແລ້ວ",
      });
  };

  const incrementQuantity = () => {
    if (quantity >= product?.amount) {
      toast.current.show({
        severity: "error",
        summary: "ແຈ້ງເຕືອນ",
        detail: "ສິນຄ້າໃນສະຕ໋ອກບໍ່ພໍຂາຍ!",
      });
      return;
    }
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <>
      <Toast position="top-center" ref={toast} />
      <CustomNavbar />
      {/* <br />
       */}
      <div className="card-cart-products">
        <div className="bread-crumb">
          <span onClick={() => router.back()}>ໜ້າຫລັກ</span>
          <RxSlash />
          <span>{product?.name}888hkjgjghfgdfsfsfjhjghhgbyfrwervlnkjopghfgdtpoiuytrwqexv,,mnnvfg</span>
        </div>
        <div className="card-view">
          <div className="card-dailog-image">
            <div className="image-view">
              <img
                src={S3_URL + previewImage}
                style={{ width: "100%", height: "100%" }}
              />
              {/* <img src={S3_URL + product?.image} /> */}
              {/* {previewImage ? (
              
              ) : (
                <img
                  src={S3_URL + defaultImage}
                  style={{ width: "100%", height: "100%" }}
                />
              )} */}
            </div>
            <div className="image-small-view">
              {product?.containImages.map((data, index) => (
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
            </div>
          </div>
          <div className="card-dailog-content">
            <h3>{product?.name}</h3>
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
              {" - "}
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
            <p>Color:</p>
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
            </div>

            <div className="card-button-preview">
              <div>
                <p
                  onClick={decrementQuantity}
                  style={{ cursor: quantity > 1 ? "pointer" : "not-allowed" }}
                >
                  <FaMinus />
                </p>
                <p style={{ userSelect: "none" }}>{quantity}</p>
                <p onClick={incrementQuantity}>
                  <FaPlus />
                </p>
              </div>
              <button onClick={handleAddProduct} style={{ userSelect: "none" }}>
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
          <div className="product-specifications">
            <h4>ຂໍ້ມູນ ຄຸນນະສົມບົດ ສິນຄ້າ</h4>
            {product?.properties.map((item, index) => (
              <div key={index}>
                <li>{item?.title}</li>
                <li>{item?.detail}</li>
              </div>
            ))}
          </div>
          <div className="product-specifications">
            <h4>ລາຍລະອຽດສິນຄ້າ</h4>

            {product?.descriptions.map((item, index) => (
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
                <p>{item?.title} title description</p>
                {item?.image && (
                  <img style={{ width: "70%" }} src={S3_URL + item?.image} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
}
