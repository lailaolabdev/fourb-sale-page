import { setOrderGroups } from "../../redux/setOrder/trackOrder";
import { CORLOR_APP, numberFormat } from "../../helper";
import { List, Timeline } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { Badge, ListGroup } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export default function index() {
  const { orderGroups } = useSelector((state) => state?.setorder);
  const navigate = useRouter();
  const dispatch = useDispatch()

  const orderInfo = orderGroups[0];
  //   console.log("orderInfo----->", orderInfo);
  const handleBack = () => {
    dispatch(setOrderGroups([]))
    navigate.back()
  };

  return (
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
        <h6>ສິນຄ້າທີ່ສັ່ງຊື້ທັງໝົດ </h6>
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
        <p>ສະຖານະການຈັດສົ່ງ ອໍເດີ້</p>
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
    </div>
  );
}
