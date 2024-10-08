import React from 'react'
import "./index.css"

import Phone from '../../img/Phone.png';
import Mail from '../../img/Mail.png';
import location from '../../img/location.png';

function Footer() {
    return (
        <footer className='footer'>
            <div className='footer__item'>
                <h4>KOIKICHI LOGISTIC</h4>
                <div className='wrapper'>
                    <div className='wrapper__item'>
                        <h5>Contact</h5>
                        <div className='item'>
                            <img src={Phone} alt="" />
                            <p>0123456789</p>
                        </div>
                    </div>
                    <div className='wrapper__item'>
                        <h5>Email</h5>
                        <div className='item'>
                            <img src={Mail} alt="" />
                            <p>abcxyz@gmail.com</p>
                        </div>
                    </div>
                    <div className='wrapper__item'>
                        <h5>Address</h5>
                        <div className='item'>
                            <img src={location} alt="" />
                            <p>FPT University, Ho Chi Minh, Viet Nam</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;