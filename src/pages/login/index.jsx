import React from 'react'
import AuthenTemplate from '../../components/authen-template';
import { Button, Checkbox, Form, Input } from 'antd';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from '../../config/firebase';
import '../login/login.css';
import Header from '../../components/header';
import Footer from '../../components/footer';
import captcha from '../../img/captcha.png';
import gg from '../../img/gg.png';
import fb from '../../img/fb.png';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';

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
    const navigate = useNavigate();
    const handleLogin = async (values) => {
        try {
            const response = await api.post("login", values);
            console.log(response)
            const { role, token } = response.data;
            localStorage.setItem("token", token);


            navigate("/dashboard")

            toast.success("Successful")
        } catch (err) {
            toast.error(err.response.data)
        }
    };




    return (
        <div>
            <Header />
            <AuthenTemplate marginBottom="500px">
                <h3>LOGIN</h3>

                <Form
                    labelCol={
                        { span: 24, }
                    }
                    onFinish={handleLogin}>

                    <Form.Item label="User Name" name="username" rules={[
                        { required: true, message: 'Please input your user name!' },
                    ]}>
                        <Input placeholder='Username' />
                    </Form.Item>

                    <Form.Item label="Password" name="password" rules={[
                        {
                            required: true,
                            message: 'Please input password!'
                        }
                    ]}>
                        <Input.Password />
                    </Form.Item>

                    <Link to='/login' > </Link>



                    <div className='submit'>
                        {/* <div className='captcha'>
                            <div><Checkbox><span className='robot'>I am not a robot</span> <br />
                                <span className='reCaptcha'>reCaptcha</span></Checkbox>;</div>
                            <div><img src={captcha} alt="" /></div>
                        </div> */}


                        <div className='submit__btn'>
                            <Button className='btn btn__login' htmlType="submit">Login</Button>
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

                </Form>

            </AuthenTemplate>


            <Footer />
        </div>

    )
}

export default LoginPage;