// import { AUTH_LAILAOLAB_SERVER, DEVELOPMENT_SERVER, PRODUCTION_SERVER, USER_KEY2 } from "../constants";
import * as _ from "lodash";
import {
  ApolloClient, 
  InMemoryCache,
  split,
} from "@apollo/client";
import { SERVER_URI } from "./helper";   

const authClient = new ApolloClient({
    // link: authLink.concat(httpLink),
    uri: SERVER_URI,
//   uri: 'http://localhost:7070/',
    cache: new InMemoryCache(),
    onError: (err) => {
      console.log("ERROR: ", err);
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

export default authClient;
