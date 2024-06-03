import CustomNavbar from "@/components/CustomNavbar";
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
        <h4>ບໍລິສັດ 4B ໂຟບີ For Business</h4>
        <OrganizationChart value={data} />
      </div>
    </>
  );
}
