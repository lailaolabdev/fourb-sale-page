import React from "react";
const versionWeb = require("../../package.json");

export default function FooterComponent() {
  return (
    <div className="footer-sale-page">
      <h3>4B Sale Page</h3>
      <span>Lailaolab ICT Solutions CO.,LTD</span>
      <small>{versionWeb?.version}</small>
    </div>
  );
}
