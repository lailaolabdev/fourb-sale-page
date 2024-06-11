import { Paginator } from 'primereact/paginator'
import React, { useState } from 'react'

export default function CustomPagination({first, rows, onPageChange, total}) {
  // const [first, setFirst] = useState(0);
  // const [rows, setRows] = useState(10);

  // const onPageChange = (event) => {
  //     setFirst(event.first);
  //     setRows(event.rows);
  // };
  return (
    <div>
      <Paginator first={first} rows={rows} totalRecords={total} onPageChange={onPageChange} />
    </div>
  )
}
