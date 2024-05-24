import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";

import { GET_ADVERTISINGS } from "../../apollo/setting/query";
import { S3_URL } from "../../helper";
import { Carousel } from "antd";
import useWindowDimensions from "../../helper/useWindowDimensions";

const imageLists = [
  {
    id: 1,
    image:
      "https://lirp.cdn-website.com/cc407b53/dms3rep/multi/opt/Creating+an+eCommerce+Website+for+Your+Clients_1500X750-640w.jpg",
    name: "ພາບໂຄສະນາສິນຄ້າ",
  },
  {
    id: 2,
    image:
      "https://removal.ai/wp-content/uploads/2021/12/eCommerce-product-images-cover.png",
    name: "ຍັງບໍ່ມີພາບໂຄສະນາ",
  },
  {
    id: 3,
    image:
      "https://www.salesforce.com/blog/wp-content/uploads/sites/2/2023/11/SF_Blog_Image_Ecommerce_Changing_Everything.png?w=889",
    name: "ຍັງບໍ່ມີພາບໂຄສະນາ",
  },
];

function SlideProduct({ shopId }) {
  const { height, width } = useWindowDimensions();
  const [advertisingdata, setAdverTisingData] = useState([]);

  const [
    getAdvertisings,
    { data: adverTisings, loading: loadingAdvertisings },
  ] = useLazyQuery(GET_ADVERTISINGS, {
    fetchPolicy: "cache-and-network",
  });

  const _getAdverTisingData = async () => {
    getAdvertisings({
      variables: {
        where: {
          shop: shopId,
          status: false,
        },
      },
    });
  };

  React.useEffect(() => {
    _getAdverTisingData();
  }, [shopId]);

  React.useEffect(() => {
    if (!adverTisings) return;
    setAdverTisingData(adverTisings?.advertisements?.data);
  }, [adverTisings]);

  return (
    <>
      <div>
        {advertisingdata?.length <= 0 ? (
          <Carousel
            speed={400}
            autoplay
            style={{
              marginTop: "4.6em",
              height: width > 700 ? "30em" : "auto",
              overflow: "hidden",
            }}
          >
            {imageLists?.map((emptyData, index) => (
              <div key={index}>
                <div
                  style={{
                    height: width < 700 ? "18em" : "auto",
                    width: "100%",
                  }}
                >
                  <img
                    src={emptyData?.image}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    alt="emptyImage"
                  />
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <>
            {!advertisingdata && loadingAdvertisings ? (
              <div style={{ fontSize: "4em" }}>loading...</div>
            ) : (
              <>
                <Carousel
                  speed={400}
                  autoplay
                  style={{
                    marginTop: "4.6em",
                    height: width > 700 ? "22em" : "auto",
                    overflow: "hidden",
                  }}
                >
                  <div>
                    {advertisingdata.map((emptyData, index) => (
                      <div key={index}>
                        <div
                          style={{
                            height: width < 700 ? "15em" : "auto",
                            width: "100%",
                          }}
                        >
                          <img
                            // src={emptyData?.image}
                            src={S3_URL + emptyData?.image}
                            style={{
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            alt="emptyImage"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Carousel>
              </>
            )}
          </>
        )}
      </div>
    </>
  );

  //  return (
  //     <>
  //       {adverTisings?.advertisements?.data?.length > 0 ? (
  //         <>
  //           <Carousel fade className="slide-banner-salePage">
  //             {imageLists?.map((emptyData, index) => (
  //               <Carousel.Item key={index} interval={5000} style={{ height:'100%',}}  >
  //                 <img src={emptyData?.image} style={{ height:'100%',border: '1px solid red'}} alt="emptyImage" />
  //               </Carousel.Item>
  //             ))}
  //           </Carousel>
  //         </>
  //       ) : (
  //         <>
  //           <Carousel fade className="slide-banner-salePage">
  //             {adverTisings?.advertisements?.data?.map((dataAver, index) => (
  //               <Carousel.Item key={index} interval={4000}>
  //                 <img src={S3_URL + dataAver?.image} alt="imageProduct" />
  //                 {/* <Carousel.Caption>
  //                   <h3>{dataAver?.name}</h3>
  //                   <p>{dataAver?.note}</p>
  //                 </Carousel.Caption> */}
  //               </Carousel.Item>
  //             ))}
  //           </Carousel>
  //         </>
  //       )}
  //     </>
  //   );
}

export default SlideProduct;
