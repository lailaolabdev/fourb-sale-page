import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import { Form } from "react-bootstrap";
import { CLIENT_ID } from "@/helper";

export default function SiginAccount({ setProfileAccount, setShowLogin }) {
 


  return (
    <div
      style={{
        width: "100%",
        padding: 20,
        height: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <p style={{ textAlign: "center" }}>
        ລ໋ອກອິນດ້ວຍ ບັນຊີ google ເພື່ອຢືນຢັນຕົວຕົນໃນການສັ່ງຊື້
      </p>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const decoded = jwtDecode(credentialResponse?.credential);
          localStorage.setItem("CLIENT_DATA", JSON.stringify(decoded));
          console.log("decoded::=>", credentialResponse)
          setProfileAccount(decoded);
          setShowLogin(false);
         
          window.location.reload();
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
        size="large"
      />
      {/* <button className="btn-login-with-google" onClick={() => onLogin()}>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxz_rSaQtZPEfuwx_AW6sKZZBmBbkZ6zHKog&s" />
        Sign in with google
      </button> */}
    </div>
  );
}
