import { checkInviceStatus } from "../../const";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import { Table } from "react-bootstrap";

export default function CollapseOrders({ datas }) {
  console.log("check orderGroups:--->", datas);
  const [expanded, setExpanded] = React.useState(0);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="w-100">
      {datas?.map((item, index) => (
        <Accordion
          variant="outlined"
          className="w-100"
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
        >
          <AccordionSummary
            expandIcon={<CaretDownOutlined />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div className="w-100 d-flex justify-content-between align-items-center">
                <p>ເລກທີບິນ: {item?.code ?? "-"}</p>
                <small
                  style={{
                    color: "orange",
                    marginTop: "-1.5em",
                    padding: 5,
                    borderRadius: 5,
                  }}
                >
                    {checkInviceStatus(item?.invoiceStatus)} 
                </small>
              </div>
              <p style={{ marginTop: "-.8em" }}>
                ເງິນລວມທັງໝົດ: {item?.sumPrice ?? 0} x{" "}
                {item?.orders?.length ?? 0}
              </p>
              <p style={{ marginTop: "-.8em" }}>
                ວັນທີ,ເດືອນ,ປີ:{" "}
                {moment(item?.createdAt).format("DD-MM-YYYY, HH:mm:ss")}
              </p>
              <p style={{ marginTop: "-.8em" }}>
                ຂໍ້ມູນຜູ້ຊື້: ຊື່: {item?.customerName ?? 0}, ເບີໂທ:{" "}
                {item?.phone}
              </p>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="d-flex justify-content-between">
              <Typography>ລາຍການສິນຄ້າ</Typography>
              <p>ທີ່ຢູ່ປາຍທາງ: {item?.logistic ?? "-"}</p>
            </div>
            <div>
              <Table>
                <thead>
                  <tr>
                    {/* <th>#</th> */}
                    <th>ຊື່ສິນຄ້າ</th>
                    <th>ຈຳນວນ</th>
                    <th>ລາຄາ</th>
                    <th>ລາຄາລວມ</th>
                  </tr>
                </thead>
                <tbody>
                  {item?.orders.map((childItem, childIndex) => (
                    <tr key={childIndex}>
                      {/* <td>{childIndex + 1}</td> */}
                      <td>
                        {childIndex + 1}. {childItem?.productName}{" "}
                      </td>
                      <td>{childItem?.amount} </td>
                      <td>
                        {childItem?.price} {childItem?.currency}
                      </td>
                      <td>
                        {childItem?.totalPrice} {childItem?.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
