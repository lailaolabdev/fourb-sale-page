import React from "react";

import { TwinSpin } from "react-cssfx-loading";

export default function LoadingComponent({ titleLoading }) {
  return (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex", 
        justifyContent: "center",
        alignItems: "center",  
        color: "#3c169b",
        flexDirection: "column",  
        gap: 10,
      }}>
      <TwinSpin color="#3c169b" width="90px" height="90px" duration="0.6s" />
      {titleLoading}
    </div>
  );
}
