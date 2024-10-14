import { useState } from "react";
import userr from "../../img/user.png";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { logout } from "../../redux/features/userSlice";
function Profile() {
  const user = useSelector((store) => store);
  console.log(user);
  const dispatch = useDispatch();

  return (
    <div className="profile">
      <div className="head bg-w">
        <img className="avatar" src={userr} alt="" />
        <h4>{user.user.name}</h4>
        <p>{user.user.email}</p>
      </div>
      <h6>INFORMATION</h6>
      <div className="bg-w ">
        <div className="information">
          <div className="item">
            <p>User Name: </p>
            <p>{user.user.username}</p>
          </div>
          <div className="item">
            <p>Phone Number: </p>
            <p>{user.user.phoneNumber}</p>
          </div>
        </div>
      </div>
      <Link to={"/login"}>
        <Button className="header__btn" onClick={() => dispatch(logout())}>
          LOGOUT
        </Button>
      </Link>
    </div>
  );
}

export default Profile;
