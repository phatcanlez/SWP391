import { Link } from "react-router-dom";
import "./index.css";
import { Button } from "antd";
import logo from "../../img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";
function Header() {
  const user = useSelector((store) => store.user);
  console.log(user);
  const dispatch = useDispatch();

  return (
    <header className="header"> 
      <div className="header__logo"> 
        {user ? (
          <>
            {user?.role === "STAFF" && (
              <Link to="/staff/order">
                <img src={logo} alt="Logo" width={80} />
              </Link>
            )}
            {user?.role === "CUSTOMER" && (
              <Link to="/customer-service/order">
                <img src={logo} alt="Logo" width={80} />
              </Link>
            )}
            {user?.role === "MANAGER" && (
              <Link to="/dashboard/overview">
                <img src={logo} alt="Logo" width={80} />
              </Link>
            )}
          </>
        ) : (
          <img src={logo} alt="Logo" width={80} />
        )}
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
