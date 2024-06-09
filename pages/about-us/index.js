import CustomNavbar from "@/components/CustomNavbar";
import FooterComponent from "@/components/salePage/FooterComponent";
import { OrganizationChart } from "primereact/organizationchart";
import React, { useState } from "react";

export default function index() {
  const [data] = useState([
    {
      label: "CEO",
      expanded: true,
      children: [
        {
          label: "ຮອງ ຜູ້ທີ 1",
          expanded: true,
          children: [
            {
              label: "ພະນັກງານ",
            },
            {
              label: "ພະນັກງານ",
            },
          ],
        },
        {
          label: "ຮ້ອງ ຜູ້ທີ 2",
          expanded: true,
          children: [
            {
              label: "ພະນັກງານ",
            },
            {
              label: "ພະນັກງານ",
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
        <img src="/assets/images/mainLogo2.png" style={{width:200, maxWidth:200,marginTop:'-2em'}} />
        <h4 style={{marginTop:'-1.85em'}}>ບໍລິສັດ 4B ໂຟບີ For Business</h4>
        <div style={{height:50}} />
        <OrganizationChart value={data} />
      </div>
      <FooterComponent />
    </>
  );
}
