import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import {
    Button,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    ListGroup,
} from "reactstrap";
import { useData } from "../context/data";

const socket = io("http://localhost:3001/chat", {
    transports: ["websocket", "polling", "flashsocket"],
});

export default function Chat(props) {
    const [msg, setMsg] = useState("");
    const [messages, setMessage] = useState([]);
    const { username, room } = useData();
    useEffect(() => {
        if (!username && !room) {
            props.history.push("/");
        }
        socket.emit("join", { username, room });
        socket.on("message", (data) => {
            console.log("data");
            setMessage((prevMessages) => [...prevMessages, data]);
        });
    }, []);
    function handleSubmit() {
        socket.emit("message", { room, username, message: msg });
        setMessage([...messages, msg]);
        setMsg("");
    }
    function handleCall() {
        props.history.push(`/call/${room}`);
    }
    return (
        <Container className="app">
            <Container style={{ marginTop: "100px" }}>
                <InputGroup>
                    <Input
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    <InputGroupAddon addonType="append">
                        <Button onClick={handleSubmit}>Submit</Button>
                    </InputGroupAddon>
                </InputGroup>
                <Button onClick={handleCall}>Call</Button>
            </Container>
            {messages.map((message, index) => {
                return <ListGroup key={index}>{message}</ListGroup>;
            })}
        </Container>
    );
}
