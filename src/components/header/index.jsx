import React from "react";
import { Link } from "react-router-dom";
import "./index.css";
import { Button } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import logo from "../../img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";

function Header() {
  const items = [
    {
      label: <a href="https://www.antgroup.com">Vietnamese</a>,
      key: "0",
    },
    {
      label: <a href="https://www.aliyun.com">Japanese</a>,
      key: "1",
    },
  ];

  const user = useSelector((store) => store.user);

  const dispatch = useDispatch();

  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="Logo" width={80} />
      </div>
      <nav className="header__nav">
        <ul>
          <li className="nav__btn">
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/about">ABOUT</Link>
          </li>
          <li>
            <Link to="/service">SERVICE</Link>
          </li>
          <li>
            <Link to="/tracking">TRACKING</Link>
          </li>
          <li>
            <Link to="/">FAQ</Link>
          </li>
          <li>
            <Link to="/">SUPPORT</Link>
          </li>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                LANGUAGE
                <CaretDownOutlined />
              </Space>
            </a>
          </Dropdown>
        </ul>
      </nav>
      <div>
        {
          user == null ? (
            <Link to={"/login"}>
              <Button className="header__btn">LOGIN</Button>
            </Link>
          ) : (
            <Link to={"/login"}>
              <Button className="header__btn" onClick={() => dispatch(logout())}>LOGOUT</Button>
            </Link>
          )
        }
      </div>

    </header>
  );
}

export default Header;
