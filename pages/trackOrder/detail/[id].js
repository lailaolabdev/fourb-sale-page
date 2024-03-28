import { CORLOR_APP, numberFormat } from "../../../helper";
import { Button, Card, Input, List, Timeline } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Badge, ListGroup } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import { GET_ORDERGROUPS } from "../../../apollo/order/query";
import FooterComponent from "../../../components/salePage/FooterComponent";
import LoadingComponent from "../../../components/LoadingComponent";
import { setOrderGroups } from "../../../redux/setOrder/trackOrder";
import { SearchOutlined } from "@ant-design/icons";
import { fill } from "lodash";
import Image from "next/image";

const statusTitle = <h5 style={{ color: "green" }}>ສະຖານະອໍເດີ້</h5>;

export default function index() {
  // const { orderGroups } = useSelector((state) => state?.setorder);
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  // const [orderInfo, setOrderInfo] = useState([]);

  const { setId } = useSelector((state) => state?.predata);
  const { idPreState } = setId || {};
  const [filter, setFilter] = useState({});

  const navigate = useRouter();
  // const [orderGroups, setOrderGroups] = useState();

  const [getTrackMyOrder, { data: trackMyOrder, loading: loadingTackOrder }] =
    useLazyQuery(GET_ORDERGROUPS, { fetchPolicy: "network-only" });

  useEffect(() => {
    fetchOrderGroups();
  }, [id]);

  const fetchOrderGroups = () => {
    getTrackMyOrder({
      variables: {
        where: {
          code: id,
        },
      },
    });
  };

  // useEffect(() => {
  //   if(filter !== "") {
  //     setOrderInfo(trackMyOrder?.orderGroups?.data[0])
  //   }
  // },[filter])
  const orderInfo = trackMyOrder?.orderGroups?.data[0];
  console.log({ orderInfo });

  const handleBack = () => {
    dispatch(setOrderGroups([]));
    const destinationPathBack =
      idPreState?.affiliateId && idPreState?.shopId
        ? `../../shop/${idPreState.shopId}?affiliateId=${
            idPreState.affiliateId
          }&commissionForShopId=${idPreState.commissionForShopId || ""}`
        : `../../shop/${idPreState?.shopId}`;

    navigate.push(destinationPathBack);
  };

  // if(loadingTackOrder) return ()

  return (
    <>
      <div className="track-order-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}>
          <div onClick={handleBack}>
            <MdArrowBack />
          </div>
          <h4>ລາຍລະອຽດອໍເດີ້ ຂອງທ່ານ</h4>
          <div></div>
        </div>

        {/* <br />

        <div style={{ width: "100%", display: "flex", gap: 10 }}>
          <Input
            size="large"
            placeholder="ປ້ອນລະຫັດອໍເດີ້..."
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setFilter({ ...filter, searchText: e.target.value });
            }}
            value={filter?.searchText}
          />
          <Button type="primary" size="large" icon={<SearchOutlined />}>ຄົ້ນຫາ</Button>
        </div>
        <br /> */}
        {loadingTackOrder ? (
          <LoadingComponent titleLoading={"ກຳລັງໂຫລດຂໍ້ມູນ..."} />
        ) : (
          <div style={{ width: "100%" }}>
            <Card
              title={statusTitle}
              bordered={false}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  overflow: "hidden",
                  borderRadius: "8em",
                }}>
                <img
                  src="/assets/images/mainLogo2.png"
                  style={{ width: "100%" }}
                />
              </div>
              <p>ກຳລັງກວດສອບ</p>
            </Card>
            <br />
            <div className="track-header">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}>
                <p>ເລກບິນ: </p>
                <h6>{orderInfo?.code}</h6>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}>
                <p> ວັນທີ, ເດືອນ, ປີ: </p>
                <p>{moment(orderInfo?.createdAt).format("DD/MM/YYYY HH:mm")}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}>
                <p>ຈຳນວນເງິນທີ່ຈ່າຍ: </p>
                <p> {numberFormat(orderInfo?.sumPrice)} ກີບ</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}>
                <p>ຊື່ຜູ້ສັ່ງຊື້: </p>
                <p>{orderInfo?.customerName}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}>
                <p>ເບີໂທລະສັບ</p>
                <p> {orderInfo?.phone}</p>
              </div>
            </div>
            <div className="track-order-list">
              <h5>
                <b>ສິນຄ້າທີ່ສັ່ງຊື້ທັງໝົດ</b>
              </h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "start",
                  width: "100%",
                }}>
                <ListGroup as="ol" numbered style={{ width: "100%" }}>
                  {orderInfo?.orders?.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      as="li"
                      className="d-flex justify-content-between align-items-start w-100">
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{item?.productName}</div>
                        <p>ລາຄາ: {numberFormat(item?.price)} ກີບ</p>
                        <p style={{ marginTop: "-1em" }}>
                          ຈຳນວນເງິນ: {numberFormat(item?.totalPrice)} ກີບ
                        </p>
                      </div>
                      <Badge bg="secondary" pill>
                        ຈຳນວນ {item?.amount}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </div>
            <div className="track-order-status">
              {/* <Timeline
        items={[
          {
            children: "Create a services site 2015-09-01",
          },
          {
            children: "Solve initial network problems 2015-09-01",
          },
          {
            children: "Technical testing 2015-09-01",
          },
          {
            children: "Network problems being solved 2015-09-01",
          },
        ]}
      /> */}
            </div>
            {/* <div>
              <h5>
                <b>ຕິດຕໍ່ຮ້ານຄ້າ</b>
              </h5>
              <div className="contact-shop">
                <Image
                  src="/assets/images/whatsAppIcon.png"
                  alt="imageContact"
                  width={50}  
                  height={50}
                />

              </div>
            </div> */}
          </div>
        )}
      </div>
      <FooterComponent />
    </>
  );
}
