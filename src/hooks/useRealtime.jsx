import { useEffect } from "react";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
function useRealtime(callback) {
  const WS_URL = "http://137.184.153.35:8080/websocket";
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

      stomp.subscribe(`/topic/interaction`, (message) => {
        console.log(message);
        callback && callback(message);
      });

      stomp.subscribe(`/topic/notification/${accountID}`, (message) => {
        console.log(message);
        callback && callback(message);
      });
    };
    stomp.connect({}, onConnected, null);
  }, []);
  return <></>;
}

export default useRealtime;
