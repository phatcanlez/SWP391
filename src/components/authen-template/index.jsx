import React, { } from 'react'
import "./index.css"
function AuthenTemplate({ children, marginBottom }) {
  return (
    <div className="authen-template" style={{ marginBottom }}>
      <h1>KOIKICHI</h1>
      <h2>Scales of Excellence in Koi Transportation</h2>
      <div className='authen-template__form'>{children}</div>
    </div>
  );
}

export default AuthenTemplate