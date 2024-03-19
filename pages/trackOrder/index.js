import { setOrderGroups } from "../../redux/setOrder/trackOrder";
import { CORLOR_APP, numberFormat } from "../../helper";
import { Card, List, Timeline } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { Badge, ListGroup } from "react-bootstrap";
import { MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CollapseOrders from "../../components/salePage/CollapseOrders";

const statusTitle = <h5 style={{color:'green'}}>ສະຖານະອໍເດີ້</h5>

export default function index() {
  const { orderGroups } = useSelector((state) => state?.setorder);
  const navigate = useRouter();
  const dispatch = useDispatch();

  // const orderInfo = orderGroups[0];
  // console.log("orderInfo----->", orderInfo);
  const handleBack = () => {
    dispatch(setOrderGroups([]));
    navigate.back();
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
      <div
        // title={statusTitle}
        // bordered={false}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingTop:5
        }}>
          <img src="/assets/images/mainLogo.png" style={{minWidth:70, maxWidth:110,}} />
          <p>ອໍເດີ້ຂອງທ່ານຢູ່ໃນລະຫວ່າງການກວດສອບ</p>
        </div>
      <br />
      <CollapseOrders datas={orderGroups} />
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
    </div>
  );
}
