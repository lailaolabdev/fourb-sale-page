import { SHOP } from "@/apollo";
import { GET_EXCHANGRATE } from "@/apollo/exchanrage";
import { GET_STOCKS } from "@/apollo/stocks";
import CustomNavbar from "@/components/CustomNavbar";
import LoadingComponent from "@/components/LoadingComponent";
import ModalPreView from "@/components/ModalPreview";
import {
  COMMISSION_OFFICE,
  S3_URL,
  calculateRoundedValue,
  numberFormat,
} from "@/helper";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoBagAddSharp } from "react-icons/io5";

export default function ShopingStore() {
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

  const [isOpenView, setIsOpenView] = useState(false);
  const parentDivRef = useRef(null);
  const [productLists, setProductsLists] = useState([]);
  const [productTotal, setProductTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [shopDetail, setShopDetail] = useState("");
  const [isStock, setIsStock] = useState(1);

  // import useLazyQuery
  const [getStocksGeneral, { data: stockData, loading: loadingStock }] = useLazyQuery(
    GET_STOCKS,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [getExchangeRate, { data: loadExchangeRate }] = useLazyQuery(
    GET_EXCHANGRATE,
    { fetchPolicy: "network-only" }
  );

  const [getShopData, { data: loadShopData }] = useLazyQuery(SHOP, {
    fetchPolicy: "network-only",
  });

  const rowsPerPage = 50;
  const pageAll = productTotal > 0 ? Math.ceil(productTotal / rowsPerPage) : 1;
  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

//   console.log("stockData:---->", stockData)

  useEffect(() => {
if(stockData) {
    setProductsLists(stockData?.stocks?.data);
    setProductTotal(stockData?.stocks?.total);
}
  },[stockData])

  // useEffect all
  useEffect(() => {
    fetchStock();
  }, [liveId, shopId, page, live, isStock]);

  // event click the outside to close modal
  useEffect(() => {
    // Event listener for clicks outside the parent div
    const handleClickOutside = (event) => {
      if (
        parentDivRef.current &&
        !parentDivRef.current.contains(event.target)
      ) {
        setIsOpenView(false);
      }
    };

    // Attach the event listener to the document body
    document.body.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpenView) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Clean up the effect when the component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isOpenView]);

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

  //   fetch stock from db
  const fetchStock = async () => {
    try {
      let _where = {
        shop: shopId,
        isDeleted: false,
        isUsingSalePage: true,
      };

      if (isStock)
        _where = {
          ..._where,
          amount: isStock,
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
    } catch (error) {
      console.log("Error fetching general stock:", error);
    }
  };

  // ຄຳນວນລາຄາສິນຄ້າຕາມ ອາຟຣິລີເອດ
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
    const roundedValue = calculateRoundedValue(priceProduct / 1000) * 1000;

    return roundedValue;
  };

  return (
    <>
      <CustomNavbar setIsStock={setIsStock} />
      <div className="container-contents">
        <h4>ຜະລິດຕະພັນຍອດນິຍົມສໍາລັບການຊື້ເຄື່ອງປະຈໍາວັນ {productTotal}</h4>
        <p>
          ເບິ່ງສິນຄ້າຍອດນິຍົມທັງໝົດຂອງພວກເຮົາໃນອາທິດນີ້.
          ທ່ານສາມາດເລືອກຜະລິດຕະພັນຄວາມຕ້ອງການປະຈໍາວັນຂອງທ່ານຈາກບັນຊີລາຍຊື່ນີ້ແລະໄດ້ຮັບຂໍ້ສະເຫນີພິເສດບາງຢ່າງທີ່ມີການຂົນສົ່ງຟຣີ.
        </p>

        <div className="card-items">
          {loadingStock ? (
            <LoadingComponent titleLoading="ກຳລັງໂຫລດຂໍ້ມູນ...!!" />
          ) : (
            <>
              {productLists.map((item, index) => (
                <div
                  className="item-now"
                  key={index}
                  onClick={() => setIsOpenView(true)}
                >
                  <div className="box-image">
                    <img src={S3_URL + item?.image} />
                  </div>
                  <div className="box-shoping">
                    <h3>{item?.name}</h3>

                    <div className="btn-price-add">
                      <div>
                        <span>50000</span>
                        <h3>
                          {numberFormat(
                            _calculatePriceWithExchangeRate(
                              item?.price ?? 0,
                              item?.currency
                            )
                          )}
                        </h3>
                      </div>
                      <button>
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
      </div>

      <div className="card-preview-product"></div>

      <ModalPreView
        isOpen={isOpenView}
        onClose={() => setIsOpenView(false)}
        parentDivRef={parentDivRef}
      />
    </>
  );
}
