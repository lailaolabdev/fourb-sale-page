import { numberFormat } from '@/helper';
import React from 'react';
import { Container, Row, Col, Table, Card } from 'react-bootstrap';

const Invoice = ({ invoiceData }) => {

   console.log(invoiceData)

   const calculateTotal = () => {
      return invoiceData.items.reduce((total, item) => total + item.price, 0);
   };

   return (
      <Container className="my-5">
         <Card>
            <Card.Body>
               <Row className="mb-4">
                  <Col>
                     <h2 className="text-primary">{invoiceData?.shop?.name}</h2>
                     <p className="text-muted">
                        ທີຢູ່: {invoiceData?.shop?.address?.village ?? ""}, {invoiceData?.shop?.address?.district ?? ""}, {invoiceData?.shop?.address?.province ?? ""}<br />
                        Tel: {invoiceData.shop?.phone ?? ""}
                     </p>
                  </Col>
                  <Col className="text-end">
                     <h1>INVOICE</h1>
                     <p>
                        <strong>Invoice No:</strong> {invoiceData.code}<br />
                        <strong>Date:</strong> {new Date(invoiceData.createdAt).toLocaleDateString()}<br />
                     </p>
                  </Col>
               </Row>

               <p>{invoiceData?.customerName ?? ""}</p>

               <Table striped bordered hover>
                  <thead>
                     <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Amount</th>
                     </tr>
                  </thead>
                  <tbody>
                     {invoiceData?.orders?.map((item, index) => (
                        <tr key={item.id}>
                           <td>{index + 1}</td>
                           <td>{item?.stock?.name ?? "-"}</td>
                           <td className="text-end">{numberFormat(item?.stock?.price ?? 0)} {item?.stock?.currency ?? "ກີບ"}</td>
                           <td className="text-end">{item?.stock?.price * item?.amount} {item?.stock?.currency ?? "ກີບ"}</td>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot>
                     <tr>
                        <td colSpan="3" className="text-end"><strong>Total</strong></td>
                        <td className="text-end"><strong>{numberFormat(invoiceData?.sumPrice ?? 0)} ກີບ</strong></td>
                     </tr>
                  </tfoot>
               </Table>

               <Row className="mt-4">
                  <Col>

                  </Col>
                  <Col className="text-end">
                     <p className="text-muted">
                        ຂອບໃຈທີ່ໃຊ້ບໍລິການ <br /> ຂໍ້ມູນເພິ່ມເຕີມ<br />
                        https://www.bbbb.com.la
                     </p>
                  </Col>
               </Row>
            </Card.Body>
         </Card>
      </Container>
   );
};

export default Invoice;