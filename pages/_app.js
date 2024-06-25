"use clients"

import "../styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

import "../styles/styleSalePage.css";
import "../styles/index.scss"; 
import "../styles/_customstyle.scss"
import "../styles/app.css"; 
import "../styles/pagination.css"; 



 

// import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import "bootstrap/dist/css/bootstrap.css";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  concat,
  split,
} from "@apollo/client";

// import { config } from "@fortawesome/fontawesome-svg-core";
import Head from "next/head";
import Script from "next/script";
import { DefaultSeo } from "next-seo";
import "react-toastify/dist/ReactToastify.css";
import { GoogleAnalytics } from "nextjs-google-analytics";
import ReactGA from "react-ga";
// import { authClient } from "./authClient";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { WebSocket } from "ws";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
// import { authClient } from "../autClient";
import { StateProvider } from "../store";
import { CLIENT_ID, S3_URL, SERVER_URI, SOCKET_SERVER_URI } from "../helper";
import { ToastContainer } from "react-toastify";
import { ToastProvider } from "react-toast-notifications";
// import HeaderSalePage from "../components/salePage/HeaderSalePage";
// import NavbarComponent from "../components/salePage/NavbarComponent";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

import 'primeicons/primeicons.css';
        

// config.autoAddCss = false;

// const TRACKING_ID = "G-TWDP034E2W";
// ReactGA.initialize(TRACKING_ID);

const App = ({ Component, pageProps }) => {
  const httpLink = new HttpLink({
    uri: SERVER_URI, // use https for secure endpoint
  });

  // create websocket link:
  const wsLink = new GraphQLWsLink(
    createClient({
      url: SOCKET_SERVER_URI,
      options: {
        reconnect: true,
      },
      webSocketImpl: WebSocket,
    })
  );

  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  const authMiddleware = new ApolloLink((operation, forward) => {
    const user = localStorage.getItem("USER_DATA");
    let token;
    if (user) {
      token = JSON.parse(user)["accessToken"];
    }
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: token ?? "",
      },
    }));

    return forward(operation);
  });

  const client = new ApolloClient({
    link: concat(authMiddleware, link),
    cache: new InMemoryCache(),
    request: (operation) => {
      const user = localStorage.getItem("USER_DATA");
      if (user) {
        const token = JSON.parse(user)["accessToken"];
        operation.setContext({
          headers: {
            authorization: token ?? "",
          },
        });
        return;
      }
    },
    onError: (err) => {
      console.log("========<e>===>ERROR: ", err);
      let isTokenError1 = _.some(err.graphQLErrors, {
        message: "Error: TokenExpiredError: jwt expired",
      });
      let isTokenError2 = _.some(err.graphQLErrors, {
        message: "Error: JsonWebTokenError: jwt must be provided",
      });
      if (isTokenError1 || isTokenError2) {
        window.location.replace("/");
      }
    },
  });

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
        integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p"
        crossOrigin="anonymous"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
        integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
        crossOrigin="anonymous"
      />
      <ToastContainer />

      <Provider store={store}>
        {/* <ApolloProvider client={authClient}> */}
        <GoogleOAuthProvider clientId={CLIENT_ID}>
        <ApolloProvider client={client}>
          <ToastProvider>
            <StateProvider>
              <PrimeReactProvider>
                <Component {...pageProps} />
              </PrimeReactProvider>
            </StateProvider>
          </ToastProvider>
        </ApolloProvider>
        </GoogleOAuthProvider>
      </Provider>
      <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
    </>
  );
};

export default App;
