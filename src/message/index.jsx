import React from "react";
import "./index.scss";

function Message({ me, text, avt }) {
  return (
    <div className={`message ${me}`}>
      <div className="message__detail">
        <div className="message__detail__avatar">
          <img src={avt} alt="" />
        </div>
        <div className="message__detail__text">
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;
