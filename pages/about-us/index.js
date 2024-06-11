import CustomNavbar from "@/components/CustomNavbar";
import FooterComponent from "@/components/salePage/FooterComponent";
import { image_main } from "@/helper";
import { OrganizationChart } from "primereact/organizationchart";
import React, { useState } from "react";

export default function index() {
  const [data] = useState([
    {
      label: "CEO",
      style: { borderRadius: '8px' },
      expanded: true,
      children: [
        {
          label: "Sale & Marketing",
          style: { borderRadius: '8px' },
          expanded: true,
          children: [
            {
              label: "ພະນັກງານ",
              style: { borderRadius: '8px' }
            },
            {
              label: "ພະນັກງານ",
              style: { borderRadius: '8px' }
            },
          ],
        },
        {
          label: "Developer",
          expanded: true,
          style: { borderRadius: '8px' },
          children: [
            {
              label: "ພະນັກງານ",
              style: { borderRadius: '8px' }
            },
            {
              label: "ພະນັກງານ",
              style: { borderRadius: '8px' }
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <CustomNavbar />
      <div className="card-about-us">
        <img src={image_main} style={{width:160, maxWidth:80,marginTop:'1em',borderRadius:'50em'}} />
        <h4 style={{marginTop:'.5em'}}>ບໍລິສັດ 4B ໂຟບີ For Business</h4>
        {/* <div style={{height:50}} /> */}
        <OrganizationChart value={data} /> 
      </div>
      <FooterComponent />
    </>
  );
}
