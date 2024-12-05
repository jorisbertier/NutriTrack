import { NavigationContainerRef } from "@react-navigation/native";
import React from "react";

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export const navigate = (name: string, params?: object) => {
    if (navigationRef.current && navigationRef.current.isReady()) {
        navigationRef.current.navigate(name, params);
    }
};