import { Collapse } from 'antd';
import React from 'react'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items = [
    {
      key: '1',
      label: 'ຕິດຕໍ່ຫາທິມງານ ກ່ຽວກັບລະບົບ',
      children: <p>{text}</p>,
    },
    {
      key: '2',
      label: 'Package ການນຳໃຊ້',
      children: <p>{text}</p>,
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: <p>{text}</p>,
    },
  ];

export default function Collapse4bShop() {
  return (
    <div style={{padding:20}}>
        <p><b>ວິທີການສະໝັກນຳໃຊ້ 4B Shop</b></p>
        <Collapse accordion items={items} />
    </div>
  )
}
