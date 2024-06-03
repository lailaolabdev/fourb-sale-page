import React from "react";

import { TwinSpin } from "react-cssfx-loading";

export default function LoadingComponent({ titleLoading, height, width }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex", 
        justifyContent: "center",
        alignItems: "center",  
        color: "#3c169b",
        flexDirection: "column",  
        gap: 10,
        fontSize:12,
        position:'fixed',zIndex:999999,top:0,left:0, background:"#ffffff"
      }}>
      <TwinSpin color="#3c169b" width={width ?? '50px'} height={height ?? '50px'} duration="0.6s" />
      {titleLoading}
    </div>
  );
}
