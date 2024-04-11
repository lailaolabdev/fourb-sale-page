import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
// import warningImage from "assets/images/warningImage_purple.png";
import Image from "next/image";
import { COLOR_TEXT, CORLOR_APP, CORLOR_WHITE } from "../../helper";

export default function ModalConfirmComponent({
  showConfirmModal,
  handleCancel,
  handleConfirm,
  loadingConfirm,
  title,
  text,
}) {
  return (
    <Modal
      show={showConfirmModal}
      onHide={handleCancel}
      backdrop="static"
      centered
      zIndex={9999}
      keyboard={false}
      className="custom-modal"
    >
      <Modal.Body>
        <div
          style={{
            width: "100%",
            height: "16em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            lineHeight: 1,
          }}
        >
          <div
            style={{
              maxWidth: "8em",
              maxHeight: "8em",
              marginTop: "-11em",
              background: "#fff",
              borderRadius: "30em",
              padding: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow:" rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
            }}
          >
            <Image
              src="/assets/images/warningImage_purple.png"
              width={"100%"}
              height={"100%"}
              alt="wninngImage"
            />
          </div>
          <h4 style={{paddingTop:20}}>
            <b>{title ?? "ແຈ້ງເຕືອນ"}</b>
          </h4>
          <p>{text}</p>
          <p>"ເຫັນດີ" ຫຼື "ບໍ່ເຫັນດີ"</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            width: "100%",
            paddingBottom: 10,
            marginTop: "-3em",
            gap: 20,
          }}
        >
          <button className="btn-confirm" onClick={handleConfirm}>
            {loadingConfirm ? <Spinner size="sm" /> : "ເຫັນດີ"}
          </button>
          <button
            variant="outline-secondary"
            className="btn-cancel"
            onClick={handleCancel}
          >
            ບໍ່ເຫັນດີ
          </button>
        </div>
      </Modal.Body>
      {/* <Modal.Footer
        >
       
      </Modal.Footer> */}
    </Modal>
  );
}
