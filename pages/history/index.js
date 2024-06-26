import { GET_ORDERGROUPS } from "@/apollo/order/query";
import CustomNavbar from "@/components/CustomNavbar";
import LoadingComponent from "@/components/LoadingComponent";
import FooterComponent from "@/components/salePage/FooterComponent";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";
// import { Accordion, AccordionTab } from "primereact/accordion";
import { Sidebar } from "primereact/sidebar"
import { Avatar } from "primereact/avatar"
import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useRef, useState } from "react";

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
import { COLOR_TEXT, S3_URL, numberFormat } from "@/helper";
import { InputGroup, Form, Button } from "react-bootstrap"
import { FaSearch } from "react-icons/fa";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";
import useWindowDimensions from "@/helper/useWindowDimensions";

export default function Index() {
  const [myInfo, setMyinfo] = useState("");
  const [newOrdergroups, setNewOrderGroups] = useState([]);

  const [expanded, setExpanded] = useState(0);
  const { height, width } = useWindowDimensions();
  const [isComment, setIsComment] = useState(false)
  const [message, setMessage] = useState()
  const [messages, setMessages] = useState([]);
  const [orderForChat, setOrderForChat] = useState()
  const messageEndRef = useRef(null);


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

  // chat with ordergroup 
  const onChatOrderGroup = (data) => {
    setIsComment(true)
    setOrderForChat(data)
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, sender: 'customer' }]);
      setMessage('');
      handleAdminResponse(message);
    }
  };

  const handleAdminResponse = (customerMessage) => {
    const adminMessage = `${customerMessage}`;
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { id: prevMessages.length + 1, text: adminMessage, sender: 'admin' }]);
    }, 5000); // Simulate a delay for the admin response
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const headChat = <div className="d-flex justify-content-start align-items-center gap-2 p-0">
    <Avatar className="p-overlay-badge" shape="circle" image={S3_URL + orderForChat?.shop?.image}>
    <Badge severity="success"></Badge>
    </Avatar>
    <div className="d-flex justify-content-start flex-column align-items-start">
      <span style={{ fontSize: 13 }}>{orderForChat?.shop?.name}</span>
      <span style={{ fontSize: 10 }}>{orderForChat?.code}</span>
    </div>
  </div>

  return (
    <>
      <CustomNavbar />
      {loadingOrderGroups && (
        <LoadingComponent titleLoading="ກຳລັງຄົ້ນຫາປະຫວັດການຊື້..." />
      )}
      <div className="card-history-buy" >
        <div className="card-info">
          {/* <input
            className="form-control"
            placeholder="ປ້ອນ ລະຫັດບິນ ຫຼື ເບີໂທລະສັບ"
            onKeyDown={onChangeFilter}
          /> */}
          <InputGroup className={`${width > 700 ? "mb-3 p-4" : "p-2 mb-3"}`}>
            <InputGroup.Text id="basic-addon1"><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="ປ້ອນ ລະຫັດບິນ ຫຼື ເບີໂທລະສັບ"
              aria-describedby="basic-addon1"
              onKeyDown={onChangeFilter}
              className="w-50"
            />
          </InputGroup>
          {/* <br /> */}

          {newOrdergroups.length > 0 ? (
            <>
              <p style={{ fontSize: 13, fontWeight: 'bold', paddingLeft: width > 700 ? 10 : 6 }}>ປະຫວັດການຊື້ຂອງທ່ານ</p>
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
                    <Typography sx={{ width: "50%", flexShrink: 0, fontSize: 13 }}>
                      {data?.code}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                      {moment(data?.createdAt).format("DD-MM-YYYY, HH:mm:ss")}
                    </Typography>
                    {/* <Typography sx={{ color: "text.secondary", ml: 2, fontSize: 12, color: 'green' }}>
                      <span>ເງິນລວມ: {numberFormat(data?.sumPrice)} ກີບ</span>
                    </Typography> */}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="left"><span>ຊື່ສິນຄ້າ</span></TableCell>
                          <TableCell align="center"><span>ຈຳນວນ</span></TableCell>
                          <TableCell align="center"><span>ລາຄາ</span></TableCell>
                          <TableCell align="right"><span>ລວມ</span></TableCell>
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

                            <TableCell align="left"><span>{idex + 1}.{item?.productName}</span></TableCell>
                            <TableCell align="center"><span>{item?.amount}</span></TableCell>
                            <TableCell align="center"><span>{numberFormat(item?.price)}</span></TableCell>
                            <TableCell align="right"><span>{numberFormat(item?.totalPrice)} {item?.currency}</span></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionDetails>
                  <div className="d-flex justify-content-between align-items-center w-100 px-3">
                        <p>ຈຳນວນເງິນທີ່ຈ່າຍຕົວຈິງ</p>
                        <p>{numberFormat(data?.sumPrice)} ກີບ</p>
                  </div>
                  <div className={`d-flex justify-content-end align-items-center w-100 ${width > 700 ? "px-4" : "px-1"}`}>
                    <div className="d-flex justify-content-start align-items-center w-100 gap-1">
                      <Avatar image={S3_URL + data?.shop?.image} shape="circle" />
                      <span style={{ fontSize: 13 }}>{data?.shop?.name}</span>
                    </div>
                    <div className="d-flex gap-2">
                      <Button disabled variant="light" size="sm">
                        <IoLogoWhatsapp style={{ fontSize: 18, marginRight: 3 }} />
                        {width > 700 && <span style={{ fontWeight: 'normal', fontSize: 12 }}>ຕິດຕໍ່ຮ້ານ</span>}
                      </Button>
                      <Button  variant="light" size="sm" 
                      onClick={() => onChatOrderGroup(data)}
                      
                      >
                        <IoChatboxEllipsesOutline style={{ fontSize: 18, marginRight: 3 }} />
                        {width > 700 && <span style={{ fontWeight: 'normal', fontSize: 12 }}>ຄອມເມັ້ນອໍເດີ້</span>}
                      </Button>
                      {/* <Button disabled variant="light" size="sm">
                        <IoMdShare style={{ fontSize: 18, marginRight: 3 }} />
                        {width > 700 && <span style={{ fontWeight: 'normal', fontSize: 12 }}>ແຊຣ</span>}
                      </Button> */}
                    </div>
                  </div>
                </Accordion>
              ))}
            </>
          ) : (
            <div className="d-flex p-4 justify-content-center align-items-center w-100">
              <img
                style={{ width: 300, maxWidth: 305 }}
                src="https://organickle.com/images/no-order.svg"
              />
            </div>
          )}
        </div>
      </div>
      <FooterComponent />


      <Sidebar visible={isComment} header={headChat} closeIcon={false} position="bottom" onHide={() => setIsComment(false)} style={{ height: 405, paddingBottom: 43 }}>
        <div className="card-comment-order" >

          {messages ? (
            <div className="message-detail">
            {messages.map((msg) => (
              <>
                <p key={msg.id} className={msg.sender === 'admin' ? 'admin-message' : 'customer-message'}>
                  {msg.text}
                  <span style={{ fontSize: 10 }}>15:29</span>
                </p>
              </>
            ))}
            <div ref={messageEndRef} />
          </div>
            ):(
              <div className="message-detail">
                <img style={{width:60, height:60}} src="https://static.vecteezy.com/system/resources/previews/016/349/591/non_2x/ask-help-submit-question-faq-button-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg" />
              </div>
            )}

          <form onSubmit={(e)=>handleSendMessage(e)} className="form-comment-control">
            <input value={message} onChange={(e) => setMessage(e?.target?.value)} placeholder="Write a comment..." />

            <button  type="submit" disabled={message ? false : true}>
              <i className="pi pi-send"></i>
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
}
