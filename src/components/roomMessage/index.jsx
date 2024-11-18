import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useStateValue } from "../../Context/StateProvider";
import ava from "../../img/ava.jpg";
// eslint-disable-next-line react/prop-types
function RoomMessage({
  room,
  active,
  setActive,
  avt,
  name,
  lastMessage,
  icon,
}) {
  const { setIdRoomChat, setShowSearchFriends, setShowChatList } =
    useStateValue();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const setShow = () => {
    setIdRoomChat(room);
    setShowSearchFriends(false);
    setActive(room);
    setShowChatList(false);
    user.role === "STAFF"
      ? navigate(`/staff/chat/${room}`)
      : navigate(`/customer-service/chat/${room}`);
  };

  return (
    <div
      className={`roomMessage ${active === room ? "active" : ""}`}
      onClick={setShow}
    >
      <img src={ava || "abc"} alt="" />
      <div className="roomMessage__detail">
        <h4>{name}</h4>
        <span>{lastMessage}</span>
      </div>
    </div>
  );
}

export default RoomMessage;
