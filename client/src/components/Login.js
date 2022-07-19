import React, { useState } from "react";
import { Button, Container, Label, Input } from "reactstrap";
import { useData } from "../context/data";

export default function Login(props) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const { setData } = useData();

  function handleSubmit() {
    setData(name, room);
    props.history.push(`/chat/${room}`);
  }
  return (
    <Container>
      <h1>Login</h1>
      <Label>Name : </Label>
      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Label>Room : </Label>
      <Input value={room} onChange={(e) => setRoom(e.target.value)} />
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
}
