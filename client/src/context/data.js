import React, { useContext, useState } from "react";

const dataContext = React.createContext();

export function useData() {
    return useContext(dataContext);
}

export function DataProvider({ children }) {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    function setData(name, room) {
        setRoom(room);
        setUsername(name);
    }
    return (
        <dataContext.Provider value={{ username, room, setData }}>
            {children}
        </dataContext.Provider>
    );
}
