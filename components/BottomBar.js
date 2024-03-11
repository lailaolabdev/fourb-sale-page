import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClockRotateLeft,
  faFileContract,
  faQrcode,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";  

export default function BottomBar({ onChange, disabled }) {
  // state
  const [tab, setTab] = useState("MENU");

  // function
  const onChangeTab = (tabSelect) => {
    setTab(tabSelect);
    onChange(tabSelect);
  };

  return (
    <div
      style={{
        minHieght: 60,
        height: 60,
        background: "#ccc",
        zIndex: 1000,
      }}
    >
      <nav className="navigation-bar">
        <ul className="list-items">
          {/* <span className="pointer"></span> */}
          <li
            className={`item active1 ${tab == "MENU" ? "active" : ""}`}
            onClick={() => {
              if (disabled) return;
              onChangeTab("MENU");
            }}
          >
            <a className="link" href="#">
              <FontAwesomeIcon
                icon={faUtensils}
                style={{ fontSize: "1.5rem" }}
              />
            </a>
          </li>
          <li
            className={`item active1 ${tab == "ORDER" ? "active" : ""}`}
            onClick={() => {
              if (disabled) return;
              onChangeTab("ORDER");
            }}
          >
            <a className="link" href="#">
              <FontAwesomeIcon
                icon={faClockRotateLeft}
                style={{ fontSize: "1.5rem" }}
              />
            </a>
          </li>

          <li
            className={`item active1 ${tab == "BILL" ? "active" : ""}`}
            onClick={() => {
              if (disabled) return;
              onChangeTab("BILL");
            }}
          >
            <a className="link" href="#">
              <FontAwesomeIcon
                icon={faFileContract}
                style={{ fontSize: "1.5rem" }}
              />
            </a>
          </li>

          <li
            className={`item active1 ${tab == "QR" ? "active" : ""}`}
            onClick={() => {
              if (disabled) return;
              onChangeTab("QR");
            }}
          >
            <a className="link" href="#">
              <FontAwesomeIcon icon={faQrcode} style={{ fontSize: "1.5rem" }} />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
