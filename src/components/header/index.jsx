import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { Button } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import logo from "../../img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
function Header() {
  const user = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleNavigate = () => {
    if(user!=null){
      if(user.role === "STAFF")
        navigate("/staff/order")
      if(user.role === "ADMIN")
        navigate("/dashboard")
    }
  };
  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">
          <img src={logo} alt="Logo" width={80} />
        </Link>
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
            <Link to="/FAQ">FAQ</Link>
          </li>
          <li>
            <Link to="/">FEEDBACK</Link>
          </li>
        </ul>
      </nav>
      <div>
        {user == null ? (
          <Link to={"/login"}>
            <Button className="header__btn">LOGIN</Button>
          </Link>
        ) : (
          <Link to={"/login"}>
            <Button className="header__btn" onClick={() => dispatch(logout())}>
              LOGOUT
            </Button>
          </Link>

          // <Link>
          //   <Avatar size={50} icon={<UserOutlined />} />
          // </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
