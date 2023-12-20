import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
// import { useInitFbSDK } from "../../helpers/fb-hooks";
// import { errorTitleWithTextSwal } from "../../helpers/sweetalert";

export const useFacebookState = () => {
  let { addToast } = useToasts();
  // useInitFbSDK();

  const [fbUserAccessToken, setFbUserAccessToken] = useState();
  const [assignedPageList, setAssignedPageList] = useState([]);
  const [assignedPageFeed, setAssignedPageFeed] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showErrorPermissionModal, setShowErrorPermissionModal] = useState(false);

  const connectFacebook = async () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        let hasPermission = true;
        ["public_profile", "email", "pages_read_engagement", "pages_show_list", "pages_messaging", "pages_manage_metadata", "pages_read_user_content"].map((_permisision) => {
          if (!response.authResponse.grantedScopes.includes(_permisision)) hasPermission = false;
        })
        if (!hasPermission) {
          addToast("ທ່ານຕ້ອງເປີດອະນຸຍາດໃຫ້ເຂົ້າເຖິງຂໍ້ມູນບໍ່ຄົບຖ້ວນ", {
            appearance: "error",
            autoDismiss: true,
          });
          setShowErrorPermissionModal(true)
          return;
        }
        setFbUserAccessToken(response.authResponse.accessToken);

        addToast("ເຂົ້າສູ່ລະບົບດ້ວຍເຟສບຸກສໍາເລັດ", {
          appearance: "success",
          autoDismiss: true,
        });
      } else
        errorTitleWithTextSwal(
          "ມີຂໍ້ຜິດພາດ",
          "ໃນການເຂົ້າສູ່ລະບົບດ້ວຍເຟສບຸກ ລອງໃຫມ່ອີກຄັ້ງ"
        );
    },
      {
        scope: `public_profile,email,
                     pages_show_list,
                     pages_read_engagement,
                     pages_messaging,
                     pages_manage_metadata,
                     pages_read_user_content`,
        return_scopes: true,
        auth_type: "rerequest"
      }
    );
  };

  // Checks if the user is logged in to Facebook
  useEffect(() => {
    setTimeout(() => {
      // console.log(isInitialized);
      if (isInitialized) {
        window.FB.getLoginStatus(
          (response) => {
            // console.log({response})
            if (response.authResponse)
              setFbUserAccessToken(response.authResponse?.accessToken);
            else
              errorTitleWithTextSwal(
                "ມີຂໍ້ຜິດພາດ",
                "ໃນການເຂົ້າສູ່ລະບົບດ້ວຍເຟສບຸກ ລອງໃຫມ່ອີກຄັ້ງ"
              );
          },
          (err) => {
            console.log(err);
          }
        );
      }
    }, 2000);
  }, [isInitialized]);

  // Fetches user pages
  useEffect(() => {
    if (fbUserAccessToken) {
      window.FB.api(
        `/me/accounts?access_token=${fbUserAccessToken}`,
        async ({ data }) => {
          window.FB.api(
            `/me?access_token=${fbUserAccessToken}`,
            async (userData) => {
              let _newData = [
                {
                  access_token: fbUserAccessToken,
                  name: userData.name + " (ສ່ວນຕົວ)",
                  id: userData.id,
                  isPrivate: true,
                },
                ...data,
              ];
              // console.log(_newData)
              await localStorage.setItem("SHOP_PAGE", JSON.stringify(_newData));
              setAssignedPageList(_newData);
            }
          );
        }
      );
    }
  }, [fbUserAccessToken]);

  const logOutOfFB = useCallback(() => {
    window.FB.logout(() => {
      setFbUserAccessToken(null);
      setAssignedPageList([]);
    });
  }, []);

  return {
    fbUserAccessToken,
    setFbUserAccessToken,
    assignedPageList,
    setAssignedPageList,
    isInitialized,
    setIsInitialized,
    assignedPageFeed,
    setAssignedPageFeed,

    connectFacebook,
    logOutOfFB,
  };
};
