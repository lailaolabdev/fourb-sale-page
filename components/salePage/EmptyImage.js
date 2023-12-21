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
        src="/assets/images/mainLogo2.png"
        style={{ width: "100%", height: "100%", opacity: "0.3" }}
        alt="empty"
      />
      <small style={{ fontSize: ".7em", marginTop: "-.6em", color: "#d4d4d4" }}>
        ບໍ່ມີຮູບພາບສິນຄ້າ
      </small>
    </div>
  );
}
