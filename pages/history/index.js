import { GET_ORDERGROUPS } from "@/apollo/order/query";
import CustomNavbar from "@/components/CustomNavbar";
import LoadingComponent from "@/components/LoadingComponent";
import FooterComponent from "@/components/salePage/FooterComponent";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";
// import { Accordion, AccordionTab } from "primereact/accordion";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { numberFormat } from "@/helper";

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
            <>
            <p style={{fontSize:13,fontWeight:'bold'}}>ປະຫວັດການຊື້ຂອງທ່ານ</p>
              {newOrdergroups.map((data, index) => (
                <Accordion
                elevation={0}
                  key={index}
                  expanded={expanded === index}
                  onChange={handleChange(index)}
                  sx={{ width: "100%" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography sx={{ width: "33%", flexShrink: 0,fontSize:13 }}>
                      {data?.code}
                    </Typography>
                    <Typography sx={{ color: "text.secondary",fontSize:12 }}>
                      {moment(data?.createdAt).format("DD-MM-YYYY, HH:mm:ss")}
                    </Typography>
                    <Typography sx={{ color: "text.secondary",ml:2,fontSize:12,color:'green' }}>
                      ເງິນລວມ: {numberFormat(data?.sumPrice)} ກີບ
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">ຊື່ສິນຄ້າ</TableCell>
                          <TableCell align="center">ຈຳນວນ</TableCell>
                          <TableCell align="center">ລາຄາ</TableCell>
                          <TableCell align="right">ລວມ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.orders.map((item, idex) => (
                          <TableRow
                          key={idex}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                         
                          <TableCell align="left">{idex + 1}.{item?.productName}</TableCell>
                          <TableCell align="center">{item?.amount}</TableCell>
                          <TableCell align="center">{numberFormat(item?.price)}</TableCell>
                          <TableCell align="right">{numberFormat(item?.totalPrice)} {item?.currency}</TableCell> 
                        </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
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
