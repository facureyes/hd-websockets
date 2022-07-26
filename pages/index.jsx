import { useEffect, useState } from "react";
import io from "Socket.IO-client";
import { Messages } from "../components/messages/messages";

let socket;

const Home = () => {
  const [name, setName] = useState(null);
  const [msgs, setMessages] = useState([]);
  const [message, setMessage] = useState("");

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
          <h2>{name}</h2>
          <hr />
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
