import React, { useEffect, useRef, useState } from "react";
import { FaRegUserCircle, FaSearch, FaShoppingCart } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { RiListCheck3, RiListIndefinite } from "react-icons/ri";
import { TbPhoneCall } from "react-icons/tb";
import { TiShoppingCart } from "react-icons/ti";
import { motion } from "framer-motion";
import CartRight from "./CartRight";
import { useRouter } from "next/router";

export default function CustomNavbar({ setIsStock }) {
  const [isShowRing, setIsShowRing] = useState(false);
  const navigate = useRouter();

  const parentDivRef = useRef(null);

  useEffect(() => {
    // Event listener for clicks outside the parent div
    const handleClickOutside = (event) => {
      if (
        parentDivRef.current &&
        !parentDivRef.current.contains(event.target)
      ) {
        setIsShowRing(false);
      }
    };

    // Attach the event listener to the document body
    document.body.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="nav-calling">
        <div>
          <TbPhoneCall />
        </div>
        <p>
          We are available 24/7, Need help? <span>+856 020 769-681-99</span>
        </p>
      </div>
      <div className="nav-top">
        <div className="nav-main">
          <div className="nav-logo">
            <img
              src="/assets/images/mainLogo2.png"
              style={{ maxWidth: 100, width: 90 }}
            />
            <div>
              <h3>ໂຟບີ </h3>
              <p>FOR BUSINESS</p>
            </div>
          </div>

          <div className="nav-form-control">
            <input
              type="text"
              placeholder="ປ້ອນຂໍ້ມູນ ເພື່ອຄົ້ນຫາສິນຄ້າຂອງທ່ານ..."
            />

            <div className="icon-search">
              <FaSearch />
            </div>
          </div>

          <div className="nav-notication">
            <div>
              <IoNotifications />
              <p>ແຈ້ງການ</p>
            </div>
            <div onClick={() => navigate.push("/cartdetail")}>
              <TiShoppingCart style={{ fontSize: 25 }} />
              <p>ກະຕ່າສິນຄ້າ</p>
              <span>5</span>
            </div>
            <div>
              <FaRegUserCircle />
              <p>ໂປຣຟາຍ</p>
            </div>
          </div>
        </div>

        <div className="nav-menu">
          <div className="menu-list">
            <li ref={parentDivRef} onClick={() => setIsShowRing(!isShowRing)}>
              <span>ສະແດງ ສິນຄ້າ</span>
              <span>
                <IoIosArrowForward />
              </span>
            </li>

            <li onClick={() => navigate.push("/")}>ໜ້າຫຼັກ</li>
            <li>ກ່ຽວກັບພວກເຮົາ</li>
            <li>ຕິດຕໍ່ພວກເຮົາ</li>
            <li>ຕິດຕາມອໍເດີ້</li>

            {isShowRing && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="card-show-products"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="arrow-item" />
                <motion.div
                  variants={{ y: 0, opacity: 0 }}
                  initial={{ y: 0, opacity: 1 }}
                  onClick={() => {
                    setIsStock(1);
                    setIsShowRing(false);
                  }}
                  className="item"
                >
                  <span>
                    <RiListCheck3 style={{ fontSize: 20 }} />
                  </span>
                  <span>ສິນຄ້າທີ່ຍັງມີສະຕ໋ອກ</span>
                </motion.div>
                <motion.div
                  variants={{ y: 0, opacity: 0 }}
                  initial={{ y: 0, opacity: 1 }}
                  onClick={() => {
                    setIsStock(0);
                    setIsShowRing(false);
                  }}
                  className="item"
                >
                  <span>
                    <RiListIndefinite style={{ fontSize: 20 }} />
                  </span>
                  <span>ສິນຄ້າທັງໝົດໃນສະຕ໋ອກ</span>
                </motion.div>
                <hr />
                <span
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    marginTop: "-.5em",
                    color: "gray",
                  }}
                >
                  ສະແດງສິນຄ້າທີ່ມີຈຳນວນ ຫຼື ສິນຄ້າທີ່ໝົດສະຕ໋ອກແລ້ວ
                </span>
              </motion.div>
            )}
          </div>

          <div className="menu-list">
            <li>ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ</li>
            <li>ຂໍ້ກຳນົດ ແລະ ເງື່ອນໄຂ</li>
          </div>
        </div>
      </div>

      {/* <CartRight /> */}
    </>
  );
}

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.2,
    },
  },
};
