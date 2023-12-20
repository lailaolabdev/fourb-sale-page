import styled from "styled-components";
import React from "react";

const StyledButton = styled.button`
  background-color: ${(props) => props.backgroundColor || "#007bff"};
  color: ${(props) => props.textColor || "#fff"};
  padding: ${(props) => props.padding || "5px"};
  font-size: ${(props) => props.fontSize || "1em"};
  font-Wize: ${(props) => props.fontWeight || "600"};
  border: ${(props) => props.border || "none"};
  border-radius: ${(props) => props.borderRadius || ".5em"};
  cursor: ${(props) => props.cursor || "no-drop"};
  width: ${(props) => props.width || "200px"};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .4em;

  &:hover {
    background-color: ${(props) => props.hoverBackgroundColor || "#0056b3"};
    color:${(props) => props.hoverColor || "#fff"};
  }
`;

function ButtonComponent({ img,text,disable, icon, type, children, onClick, ...rest }) {
  return (
    <StyledButton disable={disable} type={type} onClick={onClick} {...rest}>
      {children} {img} {icon} {text}
    </StyledButton>
  );
}

export default ButtonComponent;
