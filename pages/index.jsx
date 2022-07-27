import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Messages } from "../components/messages/messages";

let socket;

const Home = () => {
  const [name, setName] = useState(null);
  const [msgs, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const users = useRef(0);

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    const msgContainer = document.querySelector("#msg-container");
    if (msgContainer) {
      msgContainer.scroll({
        top: msgContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [msgs]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("new-message", (data) => {
      setMessages((prevStatus) => [...prevStatus, data]);
    });

    socket.on("users", (data) => {
      users.current = data;
    });
  };

  const onNameSet = (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("name-form"));
    setName(formData.get("name"));
  };

  const onMsgSent = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("message-sent", {
        id: socket.id,
        name: name,
        msg: message,
      });
    }
    setMessage("");
  };

  return (
    <>
      {!name && (
        <form id="name-form" onSubmit={onNameSet}>
          <label htmlFor="name">Enter your name</label>
          <input name="name" placeholder="Juan Perez" />
          <button type="submit">Go!</button>
        </form>
      )}
      {name && (
        <>
          <div className="navbar">
            <h2 className="name">{name}</h2>
            <p>Users connected: {users.current}</p>
          </div>
          <Messages msgs={msgs} socket={socket} />
          <form onSubmit={onMsgSent} className="msg-form">
            <input
              className="msg-input"
              name="msg"
              placeholder="Type something..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button className="msg-submit" type="submit">
              Send
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default Home;
