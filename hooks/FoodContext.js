import React, { createContext, useState } from "react";

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
    const [allDataFoodCreated, setAllDataFoodCreated] = useState([]);

    return (
        <FoodContext.Provider value={{ allDataFoodCreated, setAllDataFoodCreated }}>
            {children}
        </FoodContext.Provider>
    );
};