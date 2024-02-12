import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
// import warningImage from "assets/images/warningImage_purple.png";
import Image from "next/image";
import { CORLOR_APP, CORLOR_WHITE } from "../../helper";

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
      size="sm"
      keyboard={false}>
      <Modal.Body>
        <div
          style={{
            width: "100%",
            height: "10em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column", 
          }}>
          <div
            style={{
              width: "4em",
              height: "4em",
              marginBottom: ".5em",
            }}>
            <Image
              src="/assets/images/warningImage_purple.png"
              width={"100%"}
              height={"100%"}
              alt="wninngImage"
            />
          </div>
          <h4>{title ?? "ແຈ້ງເຕືອນ"}</h4>
          <p>{text}</p>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            width: "100%",
            gap: 10,
          }}>
          <Button variant="outline-secondary" onClick={handleCancel}>
            ຍົກເລິກ
          </Button>
          <Button
            style={{
              backgroundColor: CORLOR_APP,
              color: CORLOR_WHITE,
              border: `1px solid ${CORLOR_APP}`,
            }}
            onClick={handleConfirm}>
            {loadingConfirm ? <Spinner size="sm" /> : "ຢືນຢັນ"}
          </Button>
        </div>
      </Modal.Body>
      {/* <Modal.Footer
        >
       
      </Modal.Footer> */}
    </Modal>
  );
}
