import React from 'react'
import AuthenTemplate from '../../components/authen-template';
import { Checkbox, Form } from 'antd';
import Input from 'antd/es/input/Input';
import { Button } from 'antd';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from '../../config/firebase';
import '../login/login.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import captcha from '../../img/captcha.png';
import gg from '../../img/gg.png';
import fb from '../../img/fb.png';
import { Link } from 'react-router-dom';
function LoginPage() {

    const handleLoginGoogle = () => {
        const auth = getAuth();
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(user)
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                console.log(error)
                // Handle Errors here.  
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });

    }

    const handleLogin = () => {

    }




    return (
        <div>
            <Header />
            <AuthenTemplate>
                <h3>LOGIN</h3>
                <Form
                    labelCol={
                        { span: 24, }
                    }
                >
                    <Form.Item label="UserName or Email address" name="username" rules={[
                        { required: true, message: 'Please input your full name!' },
                    ]}>
                        <Input placeholder='Username' />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input.Password />
                    </Form.Item>
                    <Link to = '/login' > </Link>
                </Form>
                <div className='submit'>
                    <div className='captcha'>
                        <div><Checkbox><span className='robot'>I am not a robot</span> <br />
                            <span className='reCaptcha'>reCaptcha</span></Checkbox>;</div>
                        <div><img src={captcha} alt="" /></div>
                    </div>
                    <div className='submit__btn'>
                        <Button className='btn btn__login'>Login</Button>
                        <Link to={"/register"}><Button className='btn btn__register' >Register</Button></Link>
                    </div>
                </div>
                <div className='login'>
                    <Button onClick={handleLoginGoogle} className='btn' >
                        <span className='login__btn'>
                            <img src={gg} alt="" />
                            Login with Google
                        </span>
                    </Button>
                    <Button className='btn'>
                        <span className='login__btn'>
                            <img src={fb} alt="" />
                            Login with Facebook
                        </span>
                    </Button>
                    
                </div>

            </AuthenTemplate>


            <Footer />
        </div>

    )
}

export default LoginPage;