import { useEffect, useState } from "react";
import "./index.scss";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useStateValue } from "../../Context/StateProvider";
import { selectUser } from "../../redux/features/userSlice";
import useRealtime from "../../hooks/useRealtime";
import RoomMessage from "../roomMessage";
import { el } from "date-fns/locale";
import ava from "../../img/ava.jpg";
function ChatList({ setFetchRoom }) {
  const { theme, setShowSearchFriends, active, setActive, realtime } =
    useStateValue();
  const [data, setData] = useState([]);
  const [isSet, setIsSet] = useState(false);
  // const [user, setUser] = useState([]);
  const user = useSelector(selectUser);
  const { id } = useParams();

  useRealtime(async (body) => {
    if (body.body === "New message") {
      await fetch();
    }
  });
  const fetch = async () => {
    try {
      const res = await api.get("/chat");
      console.log(res.data);
      // console.log(res.data.users);
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetch();
  }, [realtime]);

  useEffect(() => {
    fetch();
  }, []);
  function isValidUrl(text) {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  }

  const renderLastMessage = (messages) => {
    if (isValidUrl(messages)) {
      return "Sent a photo";
    } else {
      return messages;
    }
  };

  return (
    <>
      <div className="chat-list">
        <div className="chat-list__information">
          <div className="chat-list__information__left">
            <img src={ava} alt="" />
            <span>{user?.name}</span>
          </div>
          <div
            className="chat-list__information__right"
            onClick={() => setShowSearchFriends(true)}
          >
            {/* <FaEdit fontSize={"20px"} color={theme ? "#fff" : "#000"} /> */}
          </div>
        </div>
        <h3>Message</h3>
        <div className="chat-list__items">
          {data.map((room) => (
            <RoomMessage
              key={room.roomID}
              room={room.roomID}
              active={active}
              setActive={setActive}
              avt={room.users.filter((item) => item.id != user.id)[0].avt}
              name={room.users.filter((item) => item.id != user.id)[0].name}
              lastMessage={renderLastMessage(room.lastMessage)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default ChatList;
