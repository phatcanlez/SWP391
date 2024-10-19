import { Link } from "react-router-dom";
import "./index.css";
import { Avatar, Button } from "antd";
import { CaretDownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import logo from "../../img/logo.png";
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
        {/* {user == null ? ( */}
          <Link to={"/login"}>
            <Button className="header__btn">LOGIN</Button>
          </Link>
        {/* ) : (
          // <Link to={"/login"}>
          //   <Button className="header__btn" onClick={() => dispatch(logout())}>LOGOUT</Button>
          // </Link>
          // <Link>
          //   <Avatar size={50} icon={<UserOutlined />} />
          // </Link>
        )} */}
      </div>
    </header>
  );
}

export default Header;
