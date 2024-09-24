import React from 'react'
import AuthenTemplate from '../../components/authen-template';
import { Form, message } from 'antd';
import Input from 'antd/es/input/Input';
import { Button } from 'antd/es/radio';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { googleProvider } from '../../config/firebase';
import Header from '../../components/header';

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
            
            <Form
                labelCol={
                    { span: 24, }
                }
            >
                <Form.Item label="UserName" name="username" rules={[
                    { required: true, message: 'Please input your full name!' },
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input.Password />
                </Form.Item>
            </Form>
            <Button>Login</Button>
            <Button onClick={handleLoginGoogle}>Google</Button>
        </AuthenTemplate>
        </div>
    )
}

export default LoginPage;