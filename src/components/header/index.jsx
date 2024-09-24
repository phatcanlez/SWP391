import React from 'react';
import { Link } from 'react-router-dom';
import "./index.css";
import { Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

// Import ảnh logo
import logo from '../../img/logo.png';

function Header() {
  const items = [
    {
      label: <a href="https://www.antgroup.com">1st menu item</a>,
      key: '0',
    },
    {
      label: <a href="https://www.aliyun.com">2nd menu item</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: '3rd menu item',
      key: '3',
    },
  ];


  return (
    <header className='header'>
      <div className='header__logo'>
        <img src={logo} alt="Logo" width={50} />
      </div>
      <nav className='header__nav'>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/">About</Link>
          </li>
          <li>
            <Link to="/">Service</Link>
          </li>
          <li>
            <Link to="/">Tracking</Link>
          </li>
          <li>
            <Link to="/">FAQ</Link>
          </li>
          <li>
            <Link to="/">Support</Link>
          </li>
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                Language
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </ul>
      </nav>
      <Button className='header__btn' type="primary">Register</Button>
    </header>
  )
}

export default Header
