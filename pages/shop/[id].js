"use client";

import { useLazyQuery, useMutation } from "@apollo/client";
import { IoBagAddSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import _ from "lodash";
import Head from "next/head";
import { Form } from "react-bootstrap"
import { useRouter } from "next/router";

// icons
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// store
import { addCartItem } from "@/redux/salepage/cartReducer";

// constants import
import {
  GET_COMMISSION_BY_INFLUENCER,
  GET_SHOP,
  SHOP,
} from "@/apollo";
import { GET_EXCHANGRATE } from "@/apollo/exchanrage";
import { GET_CATEGORYS, GET_STOCKS } from "@/apollo/stocks";
import CustomNavbar from "@/components/CustomNavbar";
import LoadingComponent from "@/components/LoadingComponent";
import FooterComponent from "@/components/salePage/FooterComponent";
import { getKeyPatch } from "@/redux/setPatch/patchBack";
import EmptyImage from "@/components/salePage/EmptyImage";
import SwiperComponent from "@/components/SwiperComponent";
import authClient from "@/autClient";
import { UPDATE_STOCK_HEART } from "@/apollo/order/mutation";

// helper import

import {
  COMMISSION_OFFICE,
  S3_URL,
  S3_URL_MEDIUM,
  calculateRoundedValue,
  numberFormat,
} from "@/helper";

function ShopingStore({ initialShop }) {
  const router = useRouter();
  const {
    liveId,
    live,
    influencer,
    id,
  } = router.query;
  const shopId = id;
  const influencerId = influencer;

  const itemsPerPage = 50;
  const [isOpenView, setIsOpenView] = useState(false);
  const parentDivRef = useRef(null);
  const [productLists, setProductsLists] = useState([]);
  const [productTotal, setProductTotal] = useState(0);

  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [shopDetail, setShopDetail] = useState("");

  const [heartAnimation, setHeartAnimation] = useState(false);
  const [isStock, setIsStock] = useState(1);
  const [filterNew, setFilterNew] = useState();
  const toast = useRef(null);
  const [categoryDatas, setCategoryDatas] = useState([]);
  const { cartList } = useSelector((state) => state?.salepage);

  const dispatch = useDispatch();

  const [getStocksGeneral, { data: stockData, loading: loadingStock }] =
    useLazyQuery(GET_STOCKS, {
      fetchPolicy: "cache-and-network",
    });

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "cache-and-network" }
  );

  const [getShopData, { data: loadShopData }] = useLazyQuery(SHOP, {
    fetchPolicy: "cache-and-network",
  });

  const [
    getShopCommissionFor,
    { data: shopDataCommissionFor },
  ] = useLazyQuery(GET_COMMISSION_BY_INFLUENCER, {
    fetchPolicy: "cache-and-network",
  });

  const [
    getCategoryData,
    { data: loadCategoryData, loading: loadingCategoryDatas },
  ] = useLazyQuery(GET_CATEGORYS, { fetchPolicy: "cache-and-network" });

  // const [updateStock] = useMutation(UPDATE_STOCK);
  const [updateStockHeart] = useMutation(UPDATE_STOCK_HEART);

  // click to scrolling to left and right
  const scrollContainerRef = useRef(null);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage?.page);
    setCount(newPage?.first);
  }, []);

  const _commissionForAffiliate = shopDataCommissionFor?.getCommissionByInfluencer?.commission;


  useEffect(() => {
    localStorage.setItem("PATCH_KEY", JSON.stringify(router?.query));
    dispatch(getKeyPatch(router?.query));

    if (shopId) {
      handleFetchDataPromise(shopId);
    }

    if (influencerId) {
      getShopCommissionFor({
        variables: {
          where: {
            infulancer: influencerId,
            shop: shopId
          },
        },
      });
    }
  }, [router?.query]);

  useEffect(() => {
    if (loadCategoryData) {
      setCategoryDatas(loadCategoryData?.categories?.data);
    }
  }, [loadCategoryData]);

  useEffect(() => {
    if (stockData) {
      setProductsLists(stockData?.stocks?.data);
      setProductTotal(stockData?.stocks?.total);
    }
  }, [stockData]);

  useEffect(() => {
    fetchStock();
  }, [liveId, shopId, currentPage, live, isStock, filterNew]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        parentDivRef.current &&
        !parentDivRef.current.contains(event.target)
      ) {
        setIsOpenView(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (loadShopData?.shop) {
      setShopDetail(loadShopData?.shop);
      localStorage.setItem("SP_SHOP_DATA", JSON.stringify(loadShopData))
    }
  }, [loadShopData]);

  const handleFetchDataPromise = async (_shopId) => {
    await getShopData({
      variables: {
        where: {
          id: _shopId,
        },
      },
    });

    await getExchangeRate({
      variables: {
        where: {
          shop: _shopId,
        },
      },
    });

    await getCategoryData({
      variables: {
        where: {
          shop: _shopId,
          isDeleted: false,
        },
      },
    });
  }

  const isExChangeRate = useMemo(() => {
    return loadExchangeRate?.exchangeRate;
  }, [loadExchangeRate?.exchangeRate]);

  const fetchStock = async () => {
    try {
      let _where = {
        shop: shopId,
        isDeleted: false,
        isUsingSalePage: true,
      };

      if (filterNew !== "") {
        _where = {
          ..._where,
          searchKeyWord: filterNew,
        };
      }

      if (!_.isEmpty(isStock)) {
        _where = {
          ..._where,
          amount: parseInt(isStock),
        };
      }

      await getStocksGeneral({
        variables: {
          orderBy: "sort_DESC",
          skip: currentPage * itemsPerPage,
          limit: itemsPerPage,
          where: _where,
        },
      });
    } catch (error) {
      console.log("Error fetching general stock:", error);
    }
  };


  const _calculatePriceWithExchangeRate = (price, currency, reduction) => {
    let _price = 0;

    // Check if isExChangeRate is defined before accessing its properties
    if (["BAHT", "ບາດ"].includes(currency)) {
      _price = price * (isExChangeRate?.baht || 0);
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      _price = price * (isExChangeRate?.usd || 0);
    } else {
      _price = price;
    }

    let priceProduct = 0;

    // Make sure influencerId is defined before using it
    if (influencerId && _commissionForAffiliate) {
      priceProduct = _price + (_price * _commissionForAffiliate) / 100;
    } else {
      priceProduct = _price;
    }

    // The commission calculation had a logic error
    if (shopDetail?.commissionService) {
      priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
    }

    // The reduction calculation was incorrect
    // ຄຳນວນສ່ວນຫຼຸດ
    if (reduction > 0 && reduction !== null) {
      priceProduct = priceProduct - (priceProduct * reduction) / 100;
    }


    return calculateRoundedValue(priceProduct / 1000) * 1000;
  };

  const handleAddProduct = (data) => {

    const existingProductIndex = cartList.findIndex(item => item.id === data.id);

    if (existingProductIndex !== -1) {
      return toast.current.show({
        severity: "error",
        summary: "ແຈ້ງເຕືອນ",
        detail: "ສິນຄ້າໃນກະຕ່າມີແລ້ວ!",
      });
    } else {
      let _price = 0;

      if (["BAHT", "ບາດ"].includes(data?.currency)) {
        _price = data?.price * isExChangeRate?.baht;
      } else if (["USD", "ໂດລາ"].includes(data?.currency)) {
        _price = data?.price * (isExChangeRate?.usd || 0);
      } else {
        _price = data?.price;
      }

      let priceProduct = 0;

      if (influencerId && _commissionForAffiliate) {
        priceProduct = _price + (_price * _commissionForAffiliate) / 100;
      } else {
        priceProduct = _price;
      }

      if (shopDetail?.commissionService) {
        priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
      }

      const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

      const { __typename, ...restData } = data;

      const _data = {
        ...restData,
        price: roundedValue,
        modelType: live,
        shop: shopId,
      };

      dispatch(addCartItem(_data));

      toast.current.show({
        severity: "success",
        summary: "ສຳເລັດ",
        detail: "ເພິ່ມສິນຄ້າເຂົ້າກະຕ່າຂອງທ່ານແລ້ວ",
      });
    }
  };

  const handleProductPreview = (item) => {
    const { __typename, ...newItem } = item;

    const shortUrl = `${newItem?.id}_${newItem?.name}`;
    router.push({
      pathname: "../product-detail",
      query: shortUrl
    })
  }

  // add heart to product
  const onAddHeartProduct = (data, index) => {
    const currentFavorites = data?.favorite || 0;
    const newFavoritesCount = currentFavorites + 1;

    updateStockHeart({
      variables: {
        where: {
          id: data?.id,
        },
        data: {
          favorite: newFavoritesCount,
        },
      },
    });
    setProductsLists((prevState) =>
      prevState.map((item) =>
        item.id === data.id ? { ...item, favorite: newFavoritesCount } : item
      )
    );
    setHeartAnimation(index);
    setTimeout(() => setHeartAnimation(null), 600);
  };

  const openWhatsApp = (data) => {
    // console.log("log phone:--->", data)
    const phoneNumber = "+856020" + data;

    // You can also include a message using the 'text' parameter.
    const message = "ສະບາຍດີ🙏";

    // Construct the WhatsApp URL using https://wa.me.
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp using the constructed URL.
    // window.open(whatsappUrl);
    window.location.href = whatsappUrl;
  };

  const ogImageUrl = initialShop
    ? `${S3_URL}${initialShop?.image}`
    : `${S3_URL}3f84530a-27a1-4591-90f3-72bfcc3d678a.png`;

  return (
    <>
      <Toast position="bottom-center" ref={toast} />
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <title>{initialShop?.name}</title>
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="ເພື່ອທຸລະກິດຂອງທ່ານ, ຊ່ວຍເຫຼືອທຸລະກິດຂອງທ່ານ, ເພີ່ມຄວາມເຊື່ອໝັ້ນໃນທຸລະກິດຂອງທ່ານ ແລະ ຮັກສາຜົນປະໂຫຍດຂອງທຸລະກິດໄດ້ເປັນຢ່າງດີ"
        />
        {/* SEO image */}
        <link rel="icon" href={ogImageUrl} type="image/icon type" />
        <meta charSet="UTF-8" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:image" content={ogImageUrl} />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <CustomNavbar setFilterNew={setFilterNew} />

      {/* <div className="d-flex gap-4">
      </div> */}
      <SwiperComponent shopDetail={shopDetail} contactshop={openWhatsApp} productTotal={productTotal} />
      <div className="body-main">
        <div>
          {/* <p style={{ paddingTop: 10, fontWeight: "bold", fontSize: 15 }}>
            ປະເພດສິນຄ້າ
          </p> */}

          {categoryDatas?.length > 0 ? (
            <div className="card-review-category">
              {/* <button className="btn-back-scroll" onClick={scrollLeft}>
                <MdArrowBackIos />
              </button> */}
              <div
                className="scrolling"
                ref={scrollContainerRef}
                style={{
                  overflowX: "auto",
                  width: "100%",
                  scrollBehavior: "smooth",
                }}
              >
                {categoryDatas.map((data, index) => (
                  <div key={index} onClick={() => router.push(`/search?search_key=${data?.name}&category=${data?.id}`)}>
                    {/* <HiMiniShoppingBag style={{ fontSize: 40 }} /> */}
                    <span>{data?.name}</span>
                  </div>
                ))}

              </div>
              {/* <button className="btn-next-scroll" onClick={scrollRight}>
                <GrNext />
              </button> */}
            </div>

          ) : (
            "..."
          )}


        </div>

        <div className="container-contents">
          <div className="d-flex py-2 justify-content-between align-items-center w-100">

            <p>
              <b>ຜະລິດຕະພັນຍອດນິຍົມ</b>{" "}
            </p>
            <Form.Select style={{ width: 180 }} value={isStock} onChange={(e) => setIsStock(e?.target?.value)}>
              <option value={1}>ສິນຄ້າ ທີ່ຍັງມີສະຕ໋ອກ</option>
              <option value={0}>ສິນຄ້າ ທີ່ສະຕ໋ອກໝົດ</option>
            </Form.Select>
          </div>
          {/* <p style={{ fontSize: 13, textAlign: "center" }}>
          ເບິ່ງສິນຄ້າຍອດນິຍົມທັງໝົດຂອງພວກເຮົາໃນອາທິດນີ້.
          ທ່ານສາມາດເລືອກຜະລິດຕະພັນຄວາມຕ້ອງການປະຈໍາວັນຂອງທ່ານຈາກບັນຊີລາຍຊື່ນີ້ແລະໄດ້ຮັບຂໍ້ສະເຫນີພິເສດບາງຢ່າງທີ່ມີການຂົນສົ່ງຟຣີ.
        </p> */}

          <div className="card-items">
            {(loadingStock && !stockData) ? (
              <LoadingComponent titleLoading="ກຳລັງໂຫລດຂໍ້ມູນ...!!" />
            ) : (
              <>
                {productLists.map((item, index) => (
                  <div
                    className="item-now"
                    key={index}
                    onClick={() => handleProductPreview(item)}
                    style={{ opacity: item?.amount <= 0 ? 0.5 : 1 }}
                  >
                    <div
                      className="favorite-view"
                      onClick={(e) => e.stopPropagation()}
                    >

                    </div>
                    <div className="box-image">
                      {item?.image ? (
                        <img
                          src={S3_URL_MEDIUM + item?.image}
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = S3_URL + item?.image;
                          }}
                        />
                      ) : (
                        <EmptyImage />
                      )}
                      {item?.reduction && (
                        <div className="promotion-field">
                          ສ່ວນຫຼຸດ {item?.reduction}%
                        </div>
                      )}
                    </div>
                    <div
                      className="box-shoping"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3>{item?.name}</h3>

                      {item?.optionValues.length > 0 &&
                        <>

                          {item?.optionValues?.map(
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


                      <div className="btn-price-add">
                        <div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <small>ຈຳນວນ: {item?.amount}</small>
                            {item?.reduction && (
                              <span>{numberFormat(item?.price)}</span>
                            )}
                          </div>
                          {/* <small
                          style={{ color: item?.amount > 5 ? "black" : "red" }}
                        >
                          Stocks: {item?.amount}
                        </small> */}

                          <h3>
                            ₭{" "}
                            {numberFormat(
                              _calculatePriceWithExchangeRate(
                                item?.price ?? 0,
                                item?.currency,
                                item?.reduction
                              )
                            )}
                          </h3>
                        </div>
                        {/* <p>{formatNumberFavorite(item?.favorite) ?? 0} sold</p> */}
                        <button disabled={item?.amount > 0 ? false : true} onClick={() => handleAddProduct(item)}>
                          <IoBagAddSharp />
                          <span>ເພິ່ມ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <div className="pt-1 d-flex justify-content-center align-items-center w-100">
            <Paginator
              first={count}
              rows={itemsPerPage}
              totalRecords={productTotal}
              onPageChange={handlePageChange}
              className="p-gination"
              style={{ maxHeight: 50, padding: 0, overflow: 'hidden' }}

              template={{ layout: "PrevPageLink CurrentPageReport NextPageLink" }}
            />
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
}

function ImageWithFallback({ item }) {
  const [url, setUrl] = useState(`${S3_URL_MEDIUM}${item.image}`);
  return (<img src={url} onError={(e) => {
    if (url !== `${S3_URL}${item.image}`) {
      setUrl(`${S3_URL}${item.image}`);
    }
  }} />);
}

export async function getServerSideProps(context) {
  let { id } = context.query;

  try {
    const {
      data: { shop },
    } = await authClient.query({
      query: GET_SHOP,
      variables: {
        where: { id: id || "" },
      },
    });

    // console.log("shop---->", shop);

    // const data = {
    //   name: "kuang",
    // };

    return {
      props: {
        error: "",
        initialShop: shop ?? {},
      },
    };

    // return {
    //   props: {
    //     data: data,
    //   },
    // };
  } catch (error) {
    return {
      props: {
        error: "SHOP_NOT_FOUND",
      },
    };
  }
}

export default ShopingStore;
