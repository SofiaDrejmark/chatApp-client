import React from "react";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const socket = io.connect("https://sofia-chat-server.herokuapp.com");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [show, setShow] = useState(true);

  const data = {
    room: currentRoom,
    username: username,
    message: newMessage,
    time: Date(),
  };

  useEffect(() => {
    socket.emit("ready");

    socket.on("receive_message", (data) => {
      setMessages((messageList) => [...messageList, data]);
    });
    socket.on("get_rooms", (data) => {
      setRooms(data);
    });
    socket.on("get_messeges", (data) => {
      setMessages(data);
    });
  }, []);

  function sendMessage() {
    if (data.message === "") {
      alert("No empty messages, thank you!");
    } else {
      socket.emit("send_message", data);
      
    }
  }

  const joinRoom = (room) => {
    console.log("join room");
    socket.emit("join_room", room);
    if (username !== "" && room !== "") {
      console.log("no emptys")
    }
    setCurrentRoom(room);
  };

  const saveUsername = (username) => {
    socket.emit("save_username", username);
    if (username !== "") {
      setShow(false);
    }
  };

  const deleteRoom = (room) => {
    socket.emit("delete_room", room);
  };

  function handleSubmit(e) {
    e.preventDefault();
  }



  return (
    <Container>
      <Modal show={show}>
        <Modal.Body>
          <Form.Control
            onSubmit={handleSubmit}
            placeholder="Username.."
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />{" "}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={() => saveUsername(username)}>
            Save Username
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col>
          <Stack direction="horizontal" gap={6}>
            <Form.Control
              onSubmit={handleSubmit}
              placeholder="Create new chat room.."
              type="text"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
            <Button type="submit" onClick={() => joinRoom(room)}>
              Save
            </Button>
          </Stack>
        </Col>
        <Col>
          <h5>
            Hi {username}! You have joined chat: {currentRoom}.
          </h5>

        </Col>
      </Row>
      <Row>
        <Col>
          <Stack
            style={{
              maxHeight: "400px",
              minHeight: "400px",
              overflowY: "auto",
              border: "gray solid 0.5px",
              borderRadius: "4px",
            }}
          >
            <h5>JOIN ROOM</h5>
            <Stack>
              {rooms.map((room) => (
                <Button
                  variant="light"
                  className={`roomDivTwo ${
                    currentRoom === room.room ? "current" : null
                  }`}
                  key={room.id}
                >
                  <Stack direction="horizontal" gap={6}>
                    <Card onClick={() => joinRoom(room.room)}>{room.room}</Card>
                    <CloseButton onClick={() => deleteRoom(room.room)} />
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Stack>
        </Col>
        <Col>
          <Stack
            style={{
              maxHeight: "400px",
              minHeight: "400px",
              overflowY: "auto",
              border: "gray solid 0.5px",
              borderRadius: "4px",
            }}
          >
            {messages.map((message) => {
              return (
                <Card key={message.id}>
                  <Card.Body>
                    <Card.Title>{message.username}</Card.Title>
                    <Card.Text>{message.message}</Card.Text>
                    <Card.Subtitle>{message.time}</Card.Subtitle>
                  </Card.Body>
                </Card>
              );
            })}
          </Stack>
        </Col>
      </Row>
      <Row>
        <FloatingLabel controlId="" label="Hey..">
          <Form.Control
            as="textarea"
            onSubmit={handleSubmit}
            placeholder="Hey.."
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
          />
        </FloatingLabel>
        <Button type="submit" className="sendButton" onClick={sendMessage}>
          Send
        </Button>
      </Row>
    </Container>
  );
}
export default App;