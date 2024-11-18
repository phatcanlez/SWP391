import React from "react";
import "./index.scss";

function isValidUrl(text) {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
}

function Message({ me, text, avt }) {
  return (
    <div className={`message ${me}`}>
      <div className="message__detail">
        <div className="message__detail__avatar">
          <img src={avt} alt="avatar" />
        </div>
        {isValidUrl(text) ? (
          <div className="message__detail__img">
            <img src={text} alt="content" />
          </div>
        ) : (
          <div className="message__detail__text">
            <p>{text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
