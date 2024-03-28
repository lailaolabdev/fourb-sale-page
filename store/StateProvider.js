import React from "react";
import { Context } from "./Context";
import { useFacebookState } from "./globalState/facebookState";

export const StateProvider = ({ children }) => {
    const _init = {};
    const facebook = useFacebookState();  
    let store = Object.assign(_init, facebook);
    return <Context.Provider value={store}>{children}</Context.Provider>;
};