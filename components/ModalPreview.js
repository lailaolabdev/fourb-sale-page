import React, { useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function ModalPreView({ isOpen, onClose, parentDivRef }) {
  if (!isOpen) return;




  return (
    <div className="card-dailog">
      <motion.div
       variants={container}
       initial="hidden"
       animate="visible"
        className="dailog"
      >
        <div className="close-dailog" onClick={onClose}>
          <IoCloseSharp />
        </div>

        <div className="card-dailog-image"></div>
        <div className="card-dailog-content">
          <h3>Product Name For preview</h3>
          <p>Stock: 50</p>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>

          <h4>250,000 kip</h4>
          <br />
          <p>Color:</p>
          <select>
            <option>red</option>
            <option>black</option>
            <option>green</option>
          </select>
          <p>Size:</p>
          <div className="size-moderm">
            <span>Small</span>
            <span>Midium</span>
            <span>Large</span>
          </div>

          <div className="card-button-preview">

            <div>
              <p><FaMinus /></p>
              <p>1</p>
              <p><FaPlus /></p>
            </div>
            <button>add to cart</button>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

const container = {
  hidden: { opacity:1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1.01,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};
