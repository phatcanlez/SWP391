import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { Input } from "antd";
import { IoIosArrowBack } from "react-icons/io";
import { useStateValue } from "../../Context/StateProvider";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import Message from "../../message";
import { selectUser } from "../../redux/features/userSlice";
import useRealtime from "../../hooks/useRealtime";
import "./index.scss";
import { FiUpload } from "react-icons/fi";
import uploadFile from "../../config/file";
function RoomChatDetail() {
  const { theme, setShowChatList, setActive, setRealtime } = useStateValue();
  const messagesContainerRef = useRef();
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const user = useSelector(selectUser);
  const params = useParams();
  const idRef = useRef(params.id);
  const [typing, setTyping] = useState("");

  const fetch = async () => {
    setData([]);
    try {
      const res = await api.get(`/chat/detail/${idRef.current}`);
      console.log(res.data);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useRealtime(async (body) => {
    console.log(body);
    if (body.body === "New message") {
      await fetch();
    } else {
      if (!body.body.includes(user.name)) {
        setTyping(body.body);
        setTimeout(() => {
          setTyping("");
        }, 2000);
      }
    }
  });

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  useEffect(() => {
    console.log(params.id);
    idRef.current = params.id;
  }, [params.id]);

  useEffect(() => {
    messagesContainerRef.current.scrollTop =
      messagesContainerRef.current.scrollHeight;
  }, [data.messages]);

  useEffect(() => {
    fetch();
  }, [params.id]);

  const sendMessage = async () => {
    if (message.length !== 0) {
      console.log("asdasd");
      const res = await api.post(`/chat/send/${idRef.current}`, {
        message: message,
      });
      setMessage("");
      fetch();
      setRealtime(res);
      // fetchRoom();
      console.log(res.data);
    }
  };

  const handleUploadFile = () => {
    document.getElementById("file").click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      console.log("Selected file:", file);
      const url = await uploadFile(file);
      await api.post(`/chat/send/${idRef.current}`, {
        message: url,
      });
      fetch();
    } else {
      console.log("No file selected");
    }
  };
  return (
    <div className="chat-detail">
      <div className="chat-detail__header">
        <div
          onClick={() => {
            setShowChatList(true);
            setActive(0);
          }}
          className="chat-detail__header__back"
        >
          <IoIosArrowBack fontSize={"30px"} />
        </div>

        <img
          src={data?.users?.filter((item) => item.id != user.id)[0].avt}
          alt=""
        />
        <div className="header__info">
          <span>
            {data?.users?.filter((item) => item.id != user.id)[0].name}
          </span>
          <div className="status">
            <div className="dot"></div>
            <span>online</span>
          </div>
        </div>
      </div>
      <div className="chat-detail__messages" ref={messagesContainerRef}>
        {/* <Message />
        <Message me="me" /> */}

        {data?.messages?.map((item) => (
          <Message
            key={item.user?.id}
            text={item?.message}
            me={item.user?.id === user?.id ? "me" : ""}
            avt={item.user.avt}
          />
        ))}
      </div>
      {typing}
      <div className="chat-detail__input">
        <Input
          onKeyDown={handleKeyDown}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onInput={async () => {
            const response = await api.post(
              `/chat/typing/${idRef.current}/${user.name}`
            );
          }}
          placeholder="Type a message"
          autoSize
          style={{
            backgroundColor: theme ? "#2b2c32" : "#f6f6f6",
            color: theme ? "#fff" : "#000",
          }}
        />

        <div className="chat-detail__input__iconSend">
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={handleFileChange} // Attach here
          />
          <FiUpload
            style={{
              cursor: "pointer",
            }}
            onClick={handleUploadFile} // Only trigger the file picker
          />
          {message.length === 0 || (
            <button onClick={sendMessage}>
              <IoSend color={theme ? "#fff" : "#000"} fontSize={"25px"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomChatDetail;
