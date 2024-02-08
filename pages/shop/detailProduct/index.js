import FooterComponent from "../../../components/salePage/FooterComponent";
import EmptyImage from "../../../components/salePage/EmptyImage";
import { CORLOR_APP, S3_URL, numberFormat } from "../../../helper";
import {
  DownloadOutlined,
  PlusOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Divider, Image, Input, InputNumber, Space } from "antd";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MdAddCircleOutline, MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem } from "../../../redux/salepage/cartReducer";
import { useRouter } from "next/router";
import ButtonComponent from "../../../components/ButtonComponent";
import useWindowDimensions from "../../../helper/useWindowDimensions";

const style = {
  background: "#fff",
  width: "100%",
  // marginRight: "-2em",
};

export default function index() {
  const { getData } = useSelector((state) => state?.productView);
  const stateData = getData;
  const dispatch = useDispatch();
  const navigate = useRouter();
  const { height, width } = useWindowDimensions();

  //   on click download product image
  const onDownload = () => {
    fetch(src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        link.remove();
      });
  };

  //   add product to cart
  const handleAddToCart = () => {
    dispatch(addCartItem(stateData));
    navigate.back();
  };

  console.log({ getData });
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1em",
          width: "100%",
        }}>
        <div className="removeIcon1" onClick={() => navigate.back()}>
          <MdArrowBack style={{ fontSize: 20 }} />
        </div>
        <div>
          <h4 style={{ marginTop: ".4em" }}>ລາຍລະອຽດສິນຄ້ານີ້</h4>
        </div>
        <div></div>
      </div>

      <Container>
        <Row>
          <Col sm={6}>
            <div style={style}>
              <div className="card-product-overview">
                <div className="card-image">
                  {stateData?.image?.length > 0 ? (
                    <Image
                      width={"100%"}
                      src={S3_URL + stateData?.image}
                      preview={{
                        toolbarRender: (
                          _,
                          {
                            transform: { scale },
                            actions: {
                              onFlipY,
                              onFlipX,
                              onRotateLeft,
                              onRotateRight,
                              onZoomOut,
                              onZoomIn,
                            },
                          }
                        ) => (
                          <Space size={12} className="toolbar-wrapper">
                            <DownloadOutlined onClick={onDownload} />
                            <SwapOutlined rotate={90} onClick={onFlipY} />
                            <SwapOutlined onClick={onFlipX} />
                            <RotateLeftOutlined onClick={onRotateLeft} />
                            <RotateRightOutlined onClick={onRotateRight} />
                            <ZoomOutOutlined
                              disabled={scale === 1}
                              onClick={onZoomOut}
                            />
                            <ZoomInOutlined
                              disabled={scale === 50}
                              onClick={onZoomIn}
                            />
                          </Space>
                        ),
                      }}
                    />
                  ) : (
                    <EmptyImage />
                  )}
                </div>
                {/* <div className="card-action-image">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div> */}
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div style={style}>
              <div className="card-product-document">
                <h1>
                  <b>{stateData?.name ?? "-"}</b>
                </h1>
                <p>{stateData?.note ?? ".................."}</p>
                <h3>
                  {/* {stateData?.price} */}
                  <b>{numberFormat(stateData?.price ?? "-")} ກີບ</b>
                </h3>
                <Divider />
                <h5>
                  <b>ປະເພດສີ: </b>
                </h5>
                <p>.....</p>
                <Divider />
                <h5>
                  <b>ຂະໜາດ: </b>
                </h5>
                <p>........</p>
                <Divider />
                <div className="d-flex gap-4 justify-content-between align-items-center">
                  <Row>
                    <Col sm={6} sx={12}>
                      <div className="action-qty p-2">
                        <h5>{/* <b>ຈຳນວນໃນສະຕ໋ອກ: </b> */}</h5>
                        <Input
                          disabled
                          addonBefore={width > 800 ? "ຈຳນວນໃນສະຕ໋ອກ" : "ຈຳນວນ"}
                          size="large"
                          value={stateData?.amount}
                          defaultValue="mysite"
                        />

                        {/* <Input value={stateData?.amount} size="large" /> */}
                        {/* <InputNumber size="large" min={1} max={100000} defaultValue={3}  /> */}
                      </div>
                    </Col>
                    <Col sm={6} sx={12}>
                      <div className="p-2">
                        <ButtonComponent
                          backgroundColor={CORLOR_APP}
                          hoverBackgroundColor={CORLOR_APP}
                          border={`1px solid ${CORLOR_APP}`}
                          cursor="pointer"
                          textColor="#FFF"
                          icon={<PlusOutlined />}
                          text="ເພິ່ມເຂົ້າກະຕ່າ"
                          fontSize="1em"
                          fontWeight={500}
                          width="100%"
                          padding=".5em"
                          type="button"
                          onClick={handleAddToCart}
                        />
                        {/* <Button size="large" type="primary" onClick={handleAddToCart} icon={<PlusOutlined />}>ເພິ່ມເຂົ້າກະຕ່າ</Button> */}
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <br />
      <FooterComponent />
    </>
  );
}
