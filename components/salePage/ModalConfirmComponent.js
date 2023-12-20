import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import warningImage from "../../images/warningImage_purple.png";
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
      keyboard={false}>
      <Modal.Body>
        <div
          style={{
            width: "100%",
            height: "12em",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}>
          <div
            style={{
              width: "5em",
              height: "5em",
              marginBottom:'.5em'
            }}>
            <Image src={warningImage} alt="wninngImage" />
          </div>
          <h4>{title ?? "ແຈ້ງເຕືອນ"}</h4>
          <p>{text}</p>
        </div>
      </Modal.Body>
      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none",
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
      </Modal.Footer>
    </Modal>
  );
}
