import React from 'react'
import { Pagination, Row, Col } from "react-bootstrap";

export default function PaginationComponent({
  count = 0,
  page = 0, 
  rowsPerPage = 10,
  pageAll = 1,
  onPageChange, 
}) {
  const pagesToDisplay = 5; // Number of pages to display around the current page
  const halfPagesToDisplay = Math.floor(pagesToDisplay / 2);

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (pageAll <= pagesToDisplay) {
      for (let i = 0; i < pageAll; i++) {
        pageNumbers.push(i);
      }
    } else if (page < halfPagesToDisplay) {
      for (let i = 0; i < pagesToDisplay; i++) {
        pageNumbers.push(i);
      }
    } else if (page >= pageAll - halfPagesToDisplay) {
      for (let i = pageAll - pagesToDisplay; i < pageAll; i++) {
        pageNumbers.push(i);
      }
    } else {
      for (let i = page - halfPagesToDisplay; i <= page + halfPagesToDisplay; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };

  return (
    <Row>
      {/* <Col xs={4} className='d-flex align-items-center'>
        <div>
          ສະແດງ {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, count)} ຈາກ {count} ລາຍການ
        </div>
      </Col> */}
      <Col xs={12} style={{ display: "flex", justifyContent: "center", }}>
        <Pagination>
          <Pagination.Prev
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          />
          {getPageNumbers().map((pageNumber) => (
            <Pagination.Item
              active={pageNumber === page}
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}>
              {pageNumber + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === pageAll - 1}
            onClick={() => onPageChange(page + 1)}
          />
           
        </Pagination>
      </Col>
    </Row>
  );
}
