import "./index.scss";
import { useMediaQuery } from "react-responsive";
import { Outlet, useParams } from "react-router-dom";
import ChatList from "../chat-list";
import { useStateValue } from "../../Context/StateProvider";
import FormSearchFriends from "../formSearchFriends";

function RoomChat() {
  const { theme, showSearchFriends, showChatList } = useStateValue();
  const isQuery = useMediaQuery({ maxWidth: 800 });
  const { param } = useParams();

  return (
    <div
      className="roomChat"
      style={{
        backgroundColor: theme ? "#202020" : "#fff",
        color: theme ? "#fff" : "#202020",
      }}
    >
      {isQuery ? (
        <>
          {showChatList && <ChatList />}
          {!showChatList && <Outlet />}
          {showSearchFriends && <FormSearchFriends />}
        </>
      ) : (
        <>
          <ChatList />
          <Outlet />
          {showSearchFriends && <FormSearchFriends />}
        </>
      )}
    </div>
  );
}

export default RoomChat;
