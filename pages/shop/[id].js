import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLazyQuery, useQuery } from "@apollo/client";

import { useRouter } from "next/router";
import HeaderSalePage from "../../components/salePage/HeaderSalePage";
import SlideProduct from "../../components/salePage/SlideProduct";
import FooterComponent from "../../components/salePage/FooterComponent";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { BsCartCheckFill, BsPlus } from "react-icons/bs";
import {
  GET_SHOP,
  GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE,
  SHOP,
} from "../../apollo";
import { GET_SALE_PAGE_LIVE_STOCKS, GET_STOCKS } from "../../apollo/stocks";
import CartModal from "../../components/salePage/CartModal";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../../redux/salepage/cartReducer";
import {
  COMMISSION_OFFICE,
  CORLOR_APP,
  CORLOR_WHITE,
  EMPTY_USER_PROFILE,
  S3_URL,
  SERVER_IP,
  calculateRoundedValue,
  emptyImage,
  numberFormat,
} from "../../helper";
import { GET_EXCHANGRATE } from "../../apollo/exchanrage";
import { setIds } from "../../redux/predata/getIds";
import useWindowDimensions from "../../helper/useWindowDimensions";
import { AiOutlineClose } from "react-icons/ai";
// import emptyProfile from "../../images/emptyProfile.jpg";
// import whatsAppIcon from "../../images/whatsAppIcon.png";
import { Avatar, Pagination } from "@mui/material";
import PaginationComponent from "../../components/salePage/PaginationComponent";
import LoadingComponent from "../../components/LoadingComponent";
import authClient from "../../autClient";
import Image from "next/image";
import { DefaultSeo } from "next-seo";
import EmptyImage from "../../components/salePage/EmptyImage";
import Head from "next/head";
import { FaUserAlt } from "react-icons/fa";
import { setStateView } from "../../redux/productView/getData";
import btoa from "btoa-lite";
import { Divider, FloatButton, List, Skeleton } from "antd";
import {
  CommentOutlined,
  CustomerServiceOutlined,
  FileSearchOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
//   import '../../styles/styleSalePage.css'

import { SpeedDial } from "primereact/speeddial";
import { Tooltip } from "primereact/tooltip";
// import { useRouter } from 'next/router';
import { Toast } from "primereact/toast";
import { message } from "antd";

const versionWeb = require("../../package.json");

function ProductSalePage({ initialShop }) {
  const router = useRouter();
  const {
    liveId,
    live,
    affiliateId,
    id,
    shopForAffiliateId,
    commissionForShopId,
  } = router.query;
  const shopId = id;

  const { height, width } = useWindowDimensions();

  // console.log("testId---->", id);
  // console.log("commissionForShopId---->", commissionForShopId);

  const [openProfileShop, setOpenProfileShop] = useState(false);
  const handleCloseProfile = () => setOpenProfileShop(false);
  const handleShowProfile = () => setOpenProfileShop(true);
  const [modalShow, setModalShow] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [viewProduct, setViewProduct] = useState();
  const dispatch = useDispatch();
  const [productLists, setProductsLists] = useState([]);
  const [productTotal, setProductTotal] = useState(0);
  const [filter, setFilter] = useState();
  const { cartList } = useSelector((state) => state?.salepage);
  const [shopDetail, setShopDetail] = useState("");

  const [isInStock, setIsInStock] = useState(1);
  const [cartDatas, setCartDatas] = useState([]);

  const [hasHore, setHasHore] = useState(true);
  const [page, setPage] = useState(0);

  const elementRef = useRef(null);

  const toast = useRef(null);

  function onIntersection(entries) {
    const firstEntery = entries[0];
    if (firstEntery.isIntersecting && hasHore) {
      // fetchHoreItems();
      fetchStock();
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(() => {});
    if (observer && elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [productLists]);

  // async function fetchHoreItems(){

  // }

  const handleCloseModals = () => {
    setModalShow(false);
  };

  // console.log("shopDetail---->", shopDetail)

  // ຈຳນວນໃນກະຕ່າສິນຄ້າ
  let totalQuantity = 0;
  for (let item of cartList) {
    totalQuantity += item?.qty;
  }

  // import useLazyQuery =======================================================================>
  // stocks not live
  const [getStocksGeneral, { loading: loadingStock }] = useLazyQuery(
    GET_STOCKS,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  // stocks is live
  const [getLiveStockData, { data: liveStocks, loading: loadingLiveStock }] =
    useLazyQuery(GET_SALE_PAGE_LIVE_STOCKS, {
      fetchPolicy: "cache-and-network",
    });

  // commission for affilite
  const [
    getShopCommissionFor,
    { data: shopDataCommissionFor, loading: shopLoading },
  ] = useLazyQuery(GET_SHOP_COMMISSION_FOR_AFFILIATE_ONE, {
    fetchPolicy: "network-only",
  });

  const [getShopData, { data: loadShopData }] = useLazyQuery(SHOP, {
    fetchPolicy: "network-only",
  });

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "network-only" }
  );

  // console.log('loadExchangeRate---->', loadExchangeRate)

  // varaible short:
  // ຕົວປ່ຽນຄ່າຄອມມິດຊັ່ນທີ່ຮ້ານ ກຳນົດໃຫ້ ອາຟຣິລີເອດ
  const _commissionForAffiliate =
    shopDataCommissionFor?.shopSettingCommissionInfluencer?.commission;

  // console.log("commission influen:------>", {
  //   shopDataCommissionFor,
  //   shopDetail,
  // });

  // pagination all =======================================================================>
  const rowsPerPage = 50;
  const pageAll = productTotal > 0 ? Math.ceil(productTotal / rowsPerPage) : 1;
  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  // use useEffect hook ==============================================================>
  // fetch shop commission for affiliate
  useEffect(() => {
    getShopCommissionFor({
      variables: {
        where: {
          id: commissionForShopId,
        },
      },
    });
  }, [commissionForShopId]);

  // fetch shop commission for shop
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
    
      fetchStock();
  }, [liveId, shopId, page, live, isInStock]);

  // get shop data
  useEffect(() => {
    if (loadShopData?.shop) {
      setShopDetail(loadShopData?.shop);
    }
  }, [loadShopData]);

  useEffect(() => {
    if (cartList) {
      const _checkdatas = cartList.filter((item) => item?.shop === shopId);
      setCartDatas(_checkdatas);
      // console.log("checkDtas:-------->", _checkdatas)
    }
  }, [cartList]);

  const isExChangeRate = useMemo(() => {
    return loadExchangeRate?.exchangeRate;
  }, [loadExchangeRate?.exchangeRate]);

  // ດືງສິນຄ້າທັງໝົດໃນ live
  // const fetchLiveStock = async () => {
  //   try {
  //     let _where = {
  //       shop: shopId,
  //       isDeleted: false,
  //       live: liveId,
  //       isPublished: true,
  //     };

  //     if (isInStock === 1)
  //       _where = {
  //         ..._where,
  //         amount: isInStock,
  //       };
  //     else {
  //       _where = { ..._where };
  //     }
  //     const message = await getLiveStockData({
  //       variables: {
  //         // orderBy: "createBy_DESC",
  //         skip: page * rowsPerPage,
  //         limit: rowsPerPage,
  //         where: {
  //           shop: shopId,
  //           isDeleted: false,
  //           live: liveId,
  //           isPublished: true,
  //         },
  //       },
  //     });

  //     const converntFieldInStock = message?.data?.salePageLiveStocks?.data?.map(
  //       (stock) => {
  //         const _newStock = stock?.stock;
  //         return {
  //           id: stock?.id,
  //           stock: _newStock?.id,
  //           price: _newStock?.price,
  //           amount: stock?.amount,
  //           unit: _newStock?.unit,
  //           cfMessage: stock?.cfMessage,
  //           note: stock?.note,
  //           currency: _newStock?.currency,
  //           image: _newStock?.image,
  //           name: _newStock?.name,
  //         };
  //       }
  //     );

  //     setProductsLists(converntFieldInStock);
  //     setProductTotal(message?.data?.salePageLiveStocks?.total);
  //   } catch (error) {
  //     console.log("Error fetching live stock:", error);
  //   }
  // };

  // ດືງສິນຄ້າທັງໝົດໃນຮ້ານ
  const fetchStock = async () => {
    try {
      let _where = {
        shop: shopId,
        isDeleted: false,
        isUsingSalePage: true,
      };

      if (isInStock === 1)
        _where = {
          ..._where,
          amount: isInStock,
        };
      else {
        _where = { ..._where };
      }

      const message = await getStocksGeneral({
        variables: {
          orderBy: "sort_DESC",
          skip: page * rowsPerPage,
          // skip: page + 1,
          limit: rowsPerPage,
          where: _where,
        },
      });

      // console.log("message general===>", message);
      setProductsLists(message?.data?.stocks?.data);
      setProductTotal(message?.data?.stocks?.total);
    } catch (error) {
      console.log("Error fetching general stock:", error);
    }
  };

  // ຄົ້ນຫາສິນຄ້າໃນໜ້າ ເຊວເພຈ ================================>
  const searchProduct = async (e) => {
    if (e.key !== "Enter") return;

    try {
      let where = {
        shop: shopId,
        isDeleted: false,

        isUsingSalePage: true,
        live: live === "LIVE" ? liveId : null,
        isPublished: live === "LIVE",
      };

      if (filter !== "") {
        where.searchKeyWord = filter;
      }

      const orderBy = "createdAt_DESC";
      const variables = {
        orderBy,
        where,
      };

      let message;
      if (live === "LIVE") {
        message = await getLiveStockData({ variables });
      } else {
        const { live, isPublished, ...updateWhere } = where;
        message = await getStocksGeneral({
          variables: { orderBy, where: updateWhere },
        });
      }

      const data = message?.data;
      const stocks = data?.salePageLiveStocks?.data || data?.stocks?.data;

      // console.log("stocks===444>", stocks);

      const convertedStocks =
        live === "LIVE"
          ? stocks?.map((stock) => ({
              id: stock?.id,
              price: stock?.stock?.price,
              amount: stock?.amount,
              unit: stock?.stock?.unit,
              cfMessage: stock?.cfMessage,
              note: stock?.note,
              currency: stock?.stock?.currency,
              image: stock?.stock?.image,
              name: stock?.stock?.name,
            }))
          : stocks;

      setProductsLists(convertedStocks);
      setProductTotal(data?.salePageLiveStocks?.total || data?.stocks?.total);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // console.log("checkCommission:--->", {
  //   service: shopDetail?.commissionService,
  //   affiliateId: commissionForShopId,
  //   affiliateCommission: _commissionForAffiliate,
  // });
  // ຄຳນວນລາຄາສິນຄ້າຕາມ ອາຟຣິລີເອດ
  const _calculatePriceWithExchangeRate = (price, currency) => {
    // console.log("currency import------->", currency)
    // console.log("price import55------->", price)

    let _price = 0;

    if (["BAHT", "ບາດ"].includes(currency)) {
      _price = price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(currency)) {
      _price = price * (isExChangeRate?.usd || 0);
    } else {
      _price = price;
    }

    // console.log("_price out------->", _price);

    let priceProduct = 0;

    if (commissionForShopId) {
      priceProduct = _price + (_price * _commissionForAffiliate) / 100;
    }else {
      priceProduct = _price
    }
    
    if (shopDetail?.commissionService) {
      priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
    }  else {

      priceProduct = _price
    }

    // console.log("priceProduct:--------view555--->", priceProduct);
    // if(commissionForShopId) {
    //  let isAffiliate = _commissionForAffiliate / 100
    //  console.log("isAffiliate:-----view--->", isAffiliate)
    //  _price + isAffiliate;
    // }
    // if(shopDetail?.commissionService){
    //   let _commiss = COMMISSION_OFFICE / 100
    //   console.log("_commiss:-----view--->", _commiss)
    //   _price + _commiss;
    // }
    // console.log("Price:-----output--->", _price)
    // priceProduct = _price;

    // const commissionRate = (shopDetail?.commision ?? 0) / 100; // commission affiliate default
    // const _commissioinForInflu = (_commissionForAffiliate ?? 0) / 100; // commission shop as an affiliate
    // const baseCommission = shopDetail?.commissionService
    //   ? _price * COMMISSION_OFFICE
    //   : 0; // percent service for Lailaolab

    // // console.log("ຄອມມິດຊັ່ນຮ້ານຕັ້ງໃຫ້ affiliate: ", _commissionForAffiliate)
    // // console.log("ຄອມມິດຊັ່ນສຳລັບ affiliate: ", commissionRate)
    // // console.log("ຄອມມິດຊັ່ນສຳລັບ lailaolab: ", COMMISSION_OFFICE)

    // if (shopDetail?.commissionAffiliate && !shopDetail?.commissionService) {
    //   priceProduct = _price + _price * commissionRate;
    // } else if (
    //   shopDetail?.commissionService &&
    //   shopDetail?.commissionAffiliate
    // ) {
    //   const affiliateCommission =
    //     commissionForShopId !== undefined
    //       ? _price * _commissioinForInflu
    //       : _price * commissionRate;

    //   priceProduct = _price + affiliateCommission + baseCommission;
    // } else if(commissionForShopId){
    //   console.log("commission_affiliate_here.....", {
    //     conmmission: _commissionForAffiliate,
    //     price: _price,
    //     commissionForShopId: commissionForShopId,
    //   } )
    //   priceProduct = _price + _commissionForAffiliate;
    // } else {
    //   priceProduct = _price + baseCommission;
    // }

    // console.log("priceProduct--99---->", priceProduct);
    // priceProduct = Math.round(priceProduct / 1000) * 1000;
    const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

    console.log("roundedValue:---------->", roundedValue);

    return roundedValue;
  };

  // console.log("productlists---nextJs-->", productLists);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleIsStockZero = () => {
    setIsInStock(0);
    setIsMenuOpen(false);
  };
  const handleIsStockThenZero = () => {
    setIsInStock(1);
    setIsMenuOpen(false);
  };
  // ສະແດງປຸ່ມຄົ້ນຫາເທິງສຸດ
  const handleShowBoxSearch = () => {
    setEnableSearch(true);
  };
  const handleHideBoxSearch = () => {
    setEnableSearch(false);
  };

  // ເປີດໂປຣຟາຍຮ້ານໃນໜ້າ sale page
  const handleViewProduct = (data) => {
    // setModalShow(true);

    let _price = 0;

    if (["BAHT", "ບາດ"].includes(data?.currency)) {
      _price = data?.price * isExChangeRate?.baht;
    } else if (["USD", "ໂດລາ"].includes(data?.currency)) {
      _price = data?.price * (isExChangeRate?.usd || 0);
    } else {
      _price = data?.price;
    }

    // console.log("_price out------->", _price)

    let priceProduct = 0;

    if (commissionForShopId) {
      priceProduct = _price + (_price * _commissionForAffiliate) / 100;
    } else {

      priceProduct = _price
    }
    
    if (shopDetail?.commissionService) {
      priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
    } else {
      priceProduct = _price;
    }

    // let priceProduct = 0;
    // const commissionRate = (shopDetail?.commision ?? 0) / 100; // commission affiliate default
    // const _commissioinForInflu = (_commissionForAffiliate ?? 0) / 100; // commission shop as an affiliate
    // const baseCommission = shopDetail?.commissionService
    //   ? _price * COMMISSION_OFFICE
    //   : 0; // percent service for Lailaolab

    // if (shopDetail?.commissionAffiliate && !shopDetail?.commissionService) {
    //   priceProduct = _price + _price * commissionRate;
    // } else if (
    //   shopDetail?.commissionService &&
    //   shopDetail?.commissionAffiliate
    // ) {
    //   const affiliateCommission =
    //     commissionForShopId !== undefined
    //       ? _price * _commissioinForInflu
    //       : _price * commissionRate;
    //   priceProduct = _price + affiliateCommission + baseCommission;
    // } else {
    //   priceProduct = _price + baseCommission;
    // }

    // priceProduct = Math.round(priceProduct / 1000) * 1000;
    const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

    // return roundedValue;

    let _data = {
      ...data,
      price: roundedValue,
    };

    // const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(_data))));

    // Decode string from Base64
    // const decodedString = atob(JSON.parse(encodedData));

    // console.log("_data--->",_data )
    // console.log("check encode and decode--->", encodedString, decodedString )

    // setViewProduct(_data);

    router.push("/shop/detailProduct");
    dispatch(setStateView(_data));
  };

  // ເພິ່ມສິນຄ້າເຂົ້າກະຕ່າ
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

      // console.log("_price out------->", _price)

      let priceProduct = 0;

      if (commissionForShopId) {
        priceProduct = _price + (_price * _commissionForAffiliate) / 100;
      } else {

        priceProduct = _price
      }
      
      if (shopDetail?.commissionService) {
        priceProduct = priceProduct + (priceProduct * COMMISSION_OFFICE) / 100;
      } else {
        priceProduct = _price;
      }

      // let priceProduct = 0;
      // const commissionRate = (shopDetail?.commision ?? 0) / 100; // commission affiliate default
      // const _commissioinForInflu = (_commissionForAffiliate ?? 0) / 100; // commission shop as an affiliate
      // const baseCommission = shopDetail?.commissionService
      //   ? _price * COMMISSION_OFFICE
      //   : 0; // percent service for Lailaolab

      // if (shopDetail?.commissionAffiliate && !shopDetail?.commissionService) {
      //   priceProduct = _price + _price * commissionRate;
      // } else if (
      //   shopDetail?.commissionService &&
      //   shopDetail?.commissionAffiliate
      // ) {
      //   const affiliateCommission =
      //     commissionForShopId !== undefined
      //       ? _price * _commissioinForInflu
      //       : _price * commissionRate;
      //   priceProduct = _price + affiliateCommission + baseCommission;
      // } else {
      //   priceProduct = _price + baseCommission;
      // }

      // priceProduct = Math.round(priceProduct / 1000) * 1000;
      const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

      // return roundedValue;

      let _data = {
        ...data,
        price: roundedValue,
      };
      console.log("data return cart--->", _data)

      dispatch(addCartItem({ ..._data, modelType: live, shop: shopId }));
    }
  };

  // ເປີດກະຕ່າຂອງຂ້ອຍ
  // const patchSalePage = { shopId, liveId, live };
  // dispatch(getPatchSalePage(patchSalePage));
  // router.push('/shop/cart-detail/' &:shopId)
  // const hadleCartProducts = () => {

  //   const destinationPath = affiliateId
  //     ? "/shop/cart-detail/" + shopId + '&' + affiliateId
  //     : "/shop/cart-detail/" + shopId;

  //   let compareData = {
  //     commision: shopDetail?.commision,
  //   };

  //   router.push(destinationPath, { ...compareData });
  // };

  const hadleCartProducts = () => {
    if (cartDatas?.length <= 0) {
      message.info("ກະຕ່າຂອງທ່ານຍັງບໍ່ມີສິນຄ້າ!");
    } else {
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

      // console.log({ idPreState });

      const destinationPath =
        idPreState.shopId &&
        idPreState.affiliateId &&
        idPreState.commissionForShopId
          ? `../cartdetail/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}&commissionForShopId=${idPreState.commissionForShopId}`
          : idPreState.shopId && idPreState.affiliateId
          ? `../cartdetail/${idPreState.shopId}?affiliateId=${idPreState.affiliateId}`
          : `../cartdetail/${idPreState?.shopId}`;

      router.push(destinationPath); // Use shallow: true if needed
      console.log("idPreState---5--->", destinationPath);

      dispatch(setIds(idPreState));
    }
  };

  const openWhatsApp = () => {
    // Replace '1234567890' with the recipient's phone number.
    // const phoneNumber = "020" + loadShopData?.shop?.phone;
    // const phoneNumber = "+85602094293951";
    const phoneNumber = "+856020" + shopDetail?.phone;

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

  const handleTrackOrderNow = () => {
    message.info("ກຳລັງພັດທະນາຢູ່!");
    // toast.info("ກຳລັງພັດທະນາຢູ່!", {
    //   autoClose: 1000,
    // });
  };

  // console.log("SEO datas:-->", initialShop);
  const ogImageUrl = initialShop
    ? `${S3_URL}${initialShop?.image}`
    : `${S3_URL}${"3f84530a-27a1-4591-90f3-72bfcc3d678a.png"}`;

  // console.log("SEO image:-->", ogImageUrl);

  return (
    <div>
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

      <HeaderSalePage
        enableSearch={enableSearch}
        cartDatas={cartDatas}
        handleShowProfile={handleShowProfile}
        loadShopData={shopDetail}
        filter={filter}
        setFilter={setFilter}
        searchProduct={searchProduct}
        handleShowBoxSearch={handleShowBoxSearch}
        handleHideBoxSearch={handleHideBoxSearch}
        // handleSearchOrder={handleSearchOrder}
        shopId={shopId}
        toggleMenu={toggleMenu}
        isMenuOpen={isMenuOpen}
        ButtonStyleFilter={ButtonStyleFilter}
        isInStock={isInStock}
        handleIsStockZero={handleIsStockZero}
        handleIsStockThenZero={handleIsStockThenZero}
        hadleCartProducts={hadleCartProducts}
      />

      {/* Branner */}
      <SlideProduct shopId={shopId} />
      {/* Branner */}

      {/* <p>456</p> */}

      <div className="containerSalepage">
        <div className="cardItems">
          {(!productLists && loadingStock) ? (
            <LoadingComponent titleLoading="ກຳລັງໂຫລດຂໍ້ມູນ...!!" />
          ) : (
            <Row
              xs={width > 320 ? 3 : 2}
              sm={4}
              lg={5}
              style={{ padding: "0" }}>
              {productLists?.map((data, index) => (
                <Col
                  key={index}
                  className="col-producct-card"
                  style={{ padding: width > 700 ? 10 : 2 }}>
                  <div
                    onClick={() => handleViewProduct(data)}
                    className="productSalePage">
                    <div className="imageViews">
                      {data?.image?.length > 0 ? (
                        <img src={S3_URL + data?.image} alt="productImage" />
                      ) : (
                        <EmptyImage />
                      )}
                    </div>
                    <div style={{ padding: 10, lineHeight: "10px" }}>
                      <div className="title-product">
                        <div className="txtH6">{data?.name}</div>
                      </div>
                      <p className="txtSmall" style={{ fontSize: ".8em" }}>
                        ຈຳນວນ: {data?.amount}
                      </p>
                      <p className="txtCurrency">
                        {numberFormat(
                          _calculatePriceWithExchangeRate(
                            data?.price ?? 0,
                            data?.currency
                          )
                        )}{" "}
                        ກີບ
                      </p>
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: ".06em 0",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                          marginTop: "-.3em",
                        }}>
                        <button
                          className="btn-add-to-cart"
                          onClick={() => handleAddProduct(data)}>
                          <BsPlus style={{ fontSize: 20 }} />
                          <span>ເພິ່ມກະຕ່າ</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
        <div className="pt-4">
          <PaginationComponent
            count={productTotal}
            rowsPerPage={rowsPerPage}
            page={page}
            pageAll={pageAll}
            onPageChange={handleChangePage}
          />
        </div>
      </div>

      {/* Footer */}
      <FooterComponent />
      {/* Footer */}

      {/* {width > 700 && (
        <>
          {cartList?.length > 0 ? (
            <div className="bage-details" onClick={hadleCartProducts}>
              <span className="bage-amount">
                {isNaN(totalQuantity) ? 0 : totalQuantity}
              </span>
              <BsCartCheckFill style={{ fontSize: 27 }} />
            </div>
          ) : (
            ""
          )}
        </>
      )} */}

      {/* {cartList?.length > 0 ? (
          <div className="bage-details" onClick={hadleCartProducts}>
            <span className="bage-amount">
              {isNaN(totalQuantity) ? 0 : totalQuantity}
            </span>
            <BsCartCheckFill style={{ fontSize: 27 }} />
          </div>
        ) : (
          ""
        )} */}

      <CartModal
        viewProduct={viewProduct}
        show={modalShow}
        handleCloseModals={handleCloseModals}
        shopDetail={shopDetail}
      />

      {/* <div className="contactWhatsapp" >
        <Image
          src="/assets/images/whatsAppIcon.png"
          alt="imageContact"
          width={50} // Set the width as per your requirement
          height={50}
          onClick={openWhatsApp}
        />
      </div> */}

      {/* profile shop */}
      <Modal
        show={openProfileShop}
        onHide={handleCloseProfile}
        centered
        animation={false}>
        <div onClick={handleCloseProfile} className="header-modal-none">
          <AiOutlineClose style={{ color: "#53079f" }} />
        </div>
        <Modal.Body>
          <div className="viewProfile p-4">
            <div className="shop-profile">
              <div className="imgShow">
                {shopDetail?.image ? (
                  <Avatar
                    alt={shopDetail?.name}
                    src={S3_URL + shopDetail?.image}
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: CORLOR_WHITE,
                      color: CORLOR_APP,
                      border: "1px solid #f2f2f2",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: "100%",
                      height: "100%",
                      background: CORLOR_WHITE,
                      color: CORLOR_APP,
                      border: "1px solid #f2f2f2",
                    }}
                    alt="emptyImage"
                    icon={<FaUserAlt />}
                  />
                )}
              </div>
              <br />
              <h4>{shopDetail?.name}</h4>
            </div>
            <br />
            <div className="show-contact-info">
              <p>ຊື່ຮ້ານ: {shopDetail?.name}</p>
              <ul style={{ marginTop: "-.5em", marginLeft: "-.8em" }}>
                <li>ເບີໂທລະສັບ: +856 20 {shopDetail?.phone ?? "........"}</li>
                <li>ທີ່ຢູ່ປັດຈຸບັນ ບ້ານ: {shopDetail?.address?.village}</li>
                <li>ເມືອງ:{shopDetail?.address?.district}</li>
                <li>ແຂວງ:{shopDetail?.address?.province}</li>
              </ul>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "1em",
                background: "#dfdfdf",
                padding: ".4em",
                borderRadius: 10,
                cursor: "pointer",
              }}
              onClick={openWhatsApp}>
              <div className="contactImageShop">
                <Image
                  src="/assets/images/whatsAppIcon.png"
                  width={"100%"}
                  height={"100%"}
                  alt="imageContact"
                />
              </div>
              &nbsp; <span>ວ໋ອດແອັບຕິດຕໍ່ ສຳລັບຮ້ານ</span>
            </div>
            {/* <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1em",
                }}>
                <br />
                <small>{versionWeb?.version}</small>
              </div> */}
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer> */}
      </Modal>

      <FloatButton.Group
        trigger="click"
        // type="primary" // Change type to primary
        style={{
          right: 24,
        }}
        icon={<CustomerServiceOutlined style={{ color: CORLOR_APP }} />}>
        <FloatButton
          tooltip={"ຕິດຕໍ່ຮ້ານ"}
          onClick={openWhatsApp}
          icon={<WhatsAppOutlined style={{ color: "green" }} />}
        />
        <FloatButton
          tooltip={"ຕິດຕາມອໍເດີ້"}
          onClick={handleTrackOrderNow}
          icon={<FileSearchOutlined style={{ color: CORLOR_APP }} />}
        />
      </FloatButton.Group>

      {/* <FloatButton.BackTop /> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  let { id } = context.query;
  console.log("context:=====>", context);

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

export default ProductSalePage;

const ButtonStyleFilter = {
  fontWeight: "700",
  padding: 6,
  border: 0,
  borderRadius: 5,
};
