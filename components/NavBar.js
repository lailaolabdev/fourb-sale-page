import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import React, { useState } from "react";

function NavBar() {
  const [show, setShow] = useState(false);


  const menuItem = [
    {
      id: 1,
      title: "Abilities",
      link: "#Abilities",
    },
    {
      id: 2,
      title: "Suitable store type",
      link: "#Suitable",
    },
    {
      id: 3,
      title: "Instruction",
      link: "#Instruction",
    },
    {
      id: 4,
      title: "Platform",
      link: "#Platform",
    },
    {
      id: 5,
      title: "Contact Us",
      link: "#Contact",
    },
  ];
  return (
    <Box
      className="card"
      // id="Abilities"
      sx={{
        paddingLeft: { md: 8, xs: 2 },
        paddingRight: { md: 8, xs: 2 },

        position: "fixed",
        width: "100%",
        background: "white",
        zIndex: 10,
      }}
    >
      {/* <h1>fsfsfs</h1> */}
      <Box
        sx={{
          height: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            boxShadow: "10px",
            height: "100%",
          }}
        >
          <img
            src="assets/images/main-app-zap-img.svg"
            alt=""
            style={{ width: "70%", height: "70%",marginRight:12 }}
          />
          <h1 className="color-orange" style={{ fontSize: 36 }}>
            AppZap
          </h1>
        </div>

        <Box sx={{ display: { md: "flex", sm: "none", xs: "none" } }}>
          {menuItem.map((menu, index) => (
            <a
              href={menu.link}
              key={index}
              className="header-color"
              style={{ marginRight: 40, fontSize: 24, textDecoration: "none" }}
            >
              {menu.title}
            </a>
          ))}
        </Box>
        <Box sx={{ display: { md: "none", sm: "flex", xs: "flex" } }}>
          <FontAwesomeIcon
            onClick={() => setShow(!show)}
            style={{ width: 30, height: 30 }}
            icon={faBars}
          />
        </Box>
      </Box>
      {show && (
        <Box
          sx={{
            display: { md: "none", sm: "flex", xs: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {menuItem.map((menu, index) => (
            <a
              href={menu.link}
              key={index}
              className="header-color"
              style={{ fontSize: 24, padding: 15, textDecoration: "none" }}
              onClick={() => setShow(false)}
            >
              {menu.title}
            </a>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default NavBar;
