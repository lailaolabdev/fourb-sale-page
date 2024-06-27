import {
  GET_SHOP,
  GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE,
  SHOP,
} from "@/apollo";
import { GET_EXCHANGRATE } from "@/apollo/exchanrage";
import { GET_STOCKS } from "@/apollo/stocks";
import CustomNavbar from "@/components/CustomNavbar";
import LoadingComponent from "@/components/LoadingComponent";
import ModalPreView from "@/components/ModalPreview";
import FooterComponent from "@/components/salePage/FooterComponent";
import PaginationComponent from "@/components/salePage/PaginationComponent";
import {
  COMMISSION_OFFICE,
  S3_URL,
  calculateRoundedValue,
  numberFormat,
} from "@/helper";
import { addCartItem } from "@/redux/salepage/cartReducer";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoBagAddSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import EmptyImage from "@/components/salePage/EmptyImage";
import CustomPagination from "@/components/CustomPagination";
import SwiperComponent from "@/components/SwiperComponent";
import { Toast } from "primereact/toast";
import authClient from "@/autClient";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { encode as base64Encode } from "js-base64";
import { MdArrowBackIos } from "react-icons/md";
import { GrNext } from "react-icons/gr";
import { Paginator } from "primereact/paginator";
import { formatNumberFavorite } from "@/const";
import { UPDATE_STOCK } from "@/apollo/order/mutation";
import { FaHeart } from "react-icons/fa";
import _ from "lodash";
import {Form} from "react-bootstrap"


function SearchProduct({ initialShop }) {
  const router = useRouter();
  const {
    liveId,
    live,
    affiliateId,
    id,
    shopForAffiliateId,
    commissionForShopId,
    search_key,
    stocks,
    category
  } = router.query;

  const itemsPerPage = 30;
  const [isOpenView, setIsOpenView] = useState(false);
  const parentDivRef = useRef(null);
  const [productLists, setProductsLists] = useState([]);
  const [productTotal, setProductTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [shopDetail, setShopDetail] = useState("");
  const [isStock, setIsStock] = useState(1);
  const [filterNew, setFilterNew] = useState();
  const [count, setCount] = useState(0);

  const [heartAnimation, setHeartAnimation] = useState(false);

  const toast = useRef(null);
  const { patchBack } = useSelector((state) => state?.setpatch);
  const shopId = patchBack?.id;

  const dispatch = useDispatch();

  const [getStocksGeneral, { data: stockData, loading: loadingStock }] =
    useLazyQuery(GET_STOCKS, {
      fetchPolicy: "cache-and-network",
    });

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "network-only" }
  );

  const [getShopData, { data: loadShopData }] = useLazyQuery(SHOP, {
    fetchPolicy: "network-only",
  });

  const [
    getShopCommissionFor,
    { data: shopDataCommissionFor, loading: shopLoading },
  ] = useLazyQuery(GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE, {
    fetchPolicy: "network-only",
  });

  const [updateStock] = useMutation(UPDATE_STOCK);

  // click to scrolling to left and right
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 100; // Adjust the value as needed
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 100; // Adjust the value as needed
    }
  };

  const totalPages = Math.ceil(productTotal / itemsPerPage);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage?.page);
    setCount(newPage?.first);
  }, []);


  const _commissionForAffiliate =
    shopDataCommissionFor?.shopSettingCommissionInfluencer?.commission;

  useEffect(() => {
    getShopCommissionFor({
      variables: {
        where: {
          id: commissionForShopId,
        },
      },
    });
  }, [commissionForShopId]);

  useEffect(() => {
    if (stockData) {
      setProductsLists(stockData?.stocks?.data);
      setProductTotal(stockData?.stocks?.total);
    }
  }, [stockData]);

  useEffect(() => {
    fetchStock();
  }, [liveId, shopId, currentPage, live, stocks, search_key, category]);

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
    getShopData({
      variables: {
        where: {
          id: shopId,
        },
      },
    });

    getExchangeRate({
      variables: {
        where: {
          shop: shopId,
        },
      },
    });
  }, [shopId]);

  useEffect(() => {
    if (loadShopData?.shop) {
      setShopDetail(loadShopData?.shop);
    }
  }, [loadShopData]);

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

      if (search_key !== "") {
        _where = {
          ..._where,
          searchKeyWord: search_key,
        };
      }


      if (!_.isEmpty(category)) {
        _where = {
          ..._where,
          category: category,
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

  const _calculatePriceWithExchangeRate = (price, currency) => {
    let _price = 0;

    if (["BAHT", "ບາດ"].includes(currency)) {
      _price = price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      _price = price * (isExChangeRate?.usd || 0);
    } else {
      _price = price;
    }

    let priceProduct = 0;

    if (commissionForShopId) {
      priceProduct = _price + (_price * _commissionForAffiliate) / 100;
    } else {
      priceProduct = _price;
    }

    if (shopDetail?.commissionService) {
      priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
    } else {
      priceProduct = _price;
    }

    return calculateRoundedValue(priceProduct / 1000) * 1000;
  };

  const handleAddProduct = (data) => {
    if (data?.amount <= 0) {
      return toast.warning(`ສິນຄ້າ ${data?.name} ໝົດສະຕ໋ອກແລ້ວ!`, {
        autoClose: 1500,
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

      if (commissionForShopId) {
        priceProduct = _price + (_price * _commissionForAffiliate) / 100;
      } else {
        priceProduct = _price;
      }

      if (shopDetail?.commissionService) {
        priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
      } else {
        priceProduct = _price;
      }

      const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

      // const _data = {
      //   ...data,
      //   price: roundedValue,
      //   modelType: live, shop: shopId
      // };

      // console.log({_data})

      const { __typename, ...restData } = data;

      const _data = {
        ...restData,
        price: roundedValue,
        modelType: live,
        shop: shopId,
      };

      console.log({ _data });

      dispatch(addCartItem(_data));

      toast.current.show({
        severity: "success",
        summary: "ສຳເລັດ",
        detail: "ເພິ່ມສິນຄ້າເຂົ້າກະຕ່າຂອງທ່ານແລ້ວ",
      });
    }
  };

  // preview my product
  const handleProductPreview = (item) => {
    const { __typename, ...newItem } = item;
    const encodedItem = base64Encode(JSON.stringify(newItem));
    router.push({
      pathname: "../detailProduct",
      query: { item: encodedItem },
    });
  };

  // add heart to product
  const onAddHeartProduct = (data, index) => {
    const currentFavorites = data?.favorite || 0;
    const newFavoritesCount = currentFavorites + 1;

    setProductsLists((prevState) =>
      prevState.map((item) =>
        item.id === data.id ? { ...item, favorite: newFavoritesCount } : item
      )
    );
    setHeartAnimation(index);
    setTimeout(() => setHeartAnimation(null), 600);

    updateStock({
      variables: {
        where: {
          id: data?.id,
        },
        data: {
          favorite: newFavoritesCount,
        },
      },
    });

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

      <CustomNavbar />

      <div className="body-main">
        <div className="container-contents">
          <div className="d-flex py-2 justify-content-between align-items-center w-100">

            <p>
            {productLists?.length > 0
              ? `ຜະລິດຕະພັນຍອດນິຍົມ`
              : `ຜົນທີ່ຄົ້ນຫາ '${search_key ?? stocks}'`}
            </p>
            <Form.Select style={{ width: 180 }} value={isStock} onChange={(e) => setIsStock(e?.target?.value)}>
            <option value={1}>ສິນຄ້າ ທີ່ຍັງມີສະຕ໋ອກ</option>
              <option value={0}>ສິນຄ້າ ທີ່ສະຕ໋ອກໝົດ</option>
            </Form.Select>
          </div>
          

          <div className="card-items">
            {!stockData && loadingStock ? (
              <LoadingComponent titleLoading="ກຳລັງໂຫລດຂໍ້ມູນ...!!" />
            ) : (
              <>
                {productLists.map((item, index) => (
                  <div
                    className="item-now"
                    key={index}
                    onClick={() => handleProductPreview(item)}
                  >
                    <div
                      className="favorite-view"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p
                        className={
                          heartAnimation === index ? "heart-animation" : ""
                        }
                        onClick={() => onAddHeartProduct(item, index)}
                      >
                        <FaHeart style={{ fontSize: 20, color: "#483D8B" }} />
                      </p>
                    </div>
                    <div className="box-image">
                      {item?.image ? (
                        <img src={S3_URL + item?.image} />
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
                        <p>{formatNumberFavorite(item?.favorite) ?? 0} sold</p>
                        {/* <button onClick={() => handleAddProduct(item)}>
                            <IoBagAddSharp />
                            <span>ເພິ່ມ</span>
                          </button> */}
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
              style={{maxHeight:50, padding:0,overflow:'hidden'}}

              template={{
                layout: "PrevPageLink CurrentPageReport NextPageLink",
              }}
            />
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
}

export async function getServerSideProps(context) {
  let { id } = context.query;
  console.log("serverside:---->", context);

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
    console.log("error-->", error);
    return {
      props: {
        error: "SHOP_NOT_FOUND",
      },
    };
  }
}

export default SearchProduct;
