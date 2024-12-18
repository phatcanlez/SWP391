import { useEffect } from "react";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
function useRealtime(callback) {
  const WS_URL = "http://103.90.227.65:8080/websocket";
  const socket = new SockJS(WS_URL);
  const stomp = Stomp.over(socket);
  const accountID = localStorage.getItem("accountId");
  useEffect(() => {
    const onConnected = () => {
      console.log("WebSocket connected");
      stomp.subscribe(`/topic/chat/${accountID}`, (message) => {
        console.log(message);
        callback && callback(message);
      });
    };
    stomp.connect({}, onConnected, null);
  }, []);
  return <></>;
}

export default useRealtime;
