import { image_main } from "@/helper";
import React from "react";

export default function EmptyImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "1em",
      }}>
      <img
        src={image_main}
        style={{ width: "50%", height: "50%", opacity: "0.2" }}
        alt="empty"
      />
      {/* <small style={{ fontSize: ".7em", marginTop: "-.6em", color: "#d4d4d4" }}>
        ບໍ່ມີຮູບພາບສິນຄ້າ
      </small> */}
    </div>
  );
}
