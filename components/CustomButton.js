import React from "react";
import ReactiveButton from "reactive-button";

 
function CustomButton({ state, type, onClick, background, text, padding, borderRadius, width, rounded, color, ...rest }) {
  return (
    <ReactiveButton
    buttonState={state}
    idleText={text}
    loadingText="Loading"
    type={type}
    size="large"
    // color="primary" 
    shadow
    rounded={rounded}
    width={width} 
    onClick={onClick}
    style={{borderRadius:borderRadius, padding: padding, background:background}}
  /> 
  );
}

export default CustomButton;
