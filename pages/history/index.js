import { GET_ORDERGROUPS } from "@/apollo/order/query";
import CustomNavbar from "@/components/CustomNavbar";
import LoadingComponent from "@/components/LoadingComponent";
import FooterComponent from "@/components/salePage/FooterComponent";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

export default function Index() {
  const [myInfo, setMyinfo] = useState("");
  const [newOrdergroups, setNewOrderGroups] = useState([]);

  const [expanded, setExpanded] = useState(0);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [getOrderGroups, { data: orderGroups, loading: loadingOrderGroups }] =
    useLazyQuery(GET_ORDERGROUPS, { fetchPolicy: "cache-and-network" });

  useEffect(() => {
    if (orderGroups?.orderGroups?.data) {
      setNewOrderGroups(orderGroups.orderGroups?.data);
    } else {
      setNewOrderGroups([]); // Ensuring it's an array
    }
  }, [orderGroups]);

  const onChangeFilter = (e) => {
    if (e.key === "Enter") {
      let _data = e?.target?.value;
      setMyinfo(_data);
      getOrderGroups({
        variables: {
          where: {
            searchKeyWord: _data,
            type: "SALE_PAGE",
          },
        },
      });
    }
  };

  return (
    <>
      <CustomNavbar />
      {loadingOrderGroups && (
        <LoadingComponent titleLoading="ກຳລັງຄົ້ນຫາປະຫວັດການຊື້..." />
      )}
      <div className="card-history-buy">
        <div className="card-info">
          <input
            className="form-control"
            placeholder="ປ້ອນ ລະຫັດບິນ ຫຼື ເບີໂທລະສັບ"
            onKeyDown={onChangeFilter}
          />
          <br />
          {newOrdergroups.length > 0 ? (
            <div>
              {newOrdergroups.map((data, index) => (
                <Accordion
                  activeIndex={expanded === index ? 0 : null}
                  onChange={handleChange(index)}
                  key={index}
                >
                  <AccordionTab
                    style={{ width: "100%" }}
                    header={
                      <span
                        className="d-flex align-items-center gap-2"
                        style={{ width: "100%" }}
                      >
                        {/* <Avatar
                          image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                          shape="circle"
                        /> */}
                        <span >{data?.code}</span>
                        <span >{moment(data?.createdAt).format("DD-MM-YYYY, HH:mm:ss")}</span>
                        <span>ຊື່ປ້ອນຕອນສັ່ງຊື້: {data?.customerName ?? "-"}</span>
                        <Badge
                          value={data?.orders?.length}
                          className="ml-auto"
                        />
                      </span>
                    }
                  >
                    <div >
                    <DataTable
                      value={data?.orders}
                      tableStyle={{ minWidth: 300, width:'100%' }}
                    >
                      <Column field="productName" header="ຊື່ສິນຄ້າ"></Column>
                      <Column field="amount" header="ຈຳນວນ"></Column>
                      <Column field="price" header="ລາຄາ"></Column>
                      <Column field="currency" header="ສະກຸນ"></Column>
                    </DataTable>
                    </div>
                    <p>ລວມທັງໝົດ: {data?.sumPrice}</p>
                  </AccordionTab>
                </Accordion>
              ))}
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center w-100">
              <img
                style={{ width: 300, maxWidth: 305 }}
                src="https://t4.ftcdn.net/jpg/06/95/34/09/360_F_695340925_WXBUS1qhrEkdOijyYYyId0exOTqavAJu.jpg"
              />
            </div>
          )}
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
