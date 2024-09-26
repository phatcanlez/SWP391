import React, { } from 'react'
import "./index.css"
function AuthenTemplate({ children }) {
  return (
    <div className="authen-template">
      <h1>KOIKICHI</h1>
      <h2>Scales of Excellence in Koi Transportation</h2>
      <div className='authen-template__form'>{children}</div>
    </div>
  );
}

export default AuthenTemplate