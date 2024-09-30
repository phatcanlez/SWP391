import React from 'react'
import AuthenTemplate from '../../components/authen-template';
import { DatePicker, Form, Input } from 'antd';
import { Button } from 'antd';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../register/register.css';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';
function RegisterPage() {

    const navigate = useNavigate();

    const handleRegister = async (values) => {
        try {
            values.role = "CUSTOMER"
            const response = await api.post("register", values);
            toast.success("Successfully")
            navigate("/login")
        } catch (err) {
            toast.error(err.response.data);
        }
    };


    return (
        <div>
            <Header />
            <AuthenTemplate>
                <h3>REGISTRATION</h3>
                <Form
                    labelCol={{
                        span: 24,
                    }}
                    onFinish={handleRegister}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please input your name!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="User name"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input your username!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 3, message: 'Password must be at least 3 characters long!' },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder='Password must be at least 6 characters long' />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>



                    <Form.Item
                        label="Phone number"
                        name="phoneNumber"
                        rules={[

                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            {
                                type: 'email',
                                message: 'Please enter a valid email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                        ]}
                    >
                        <Input />
                    </Form.Item>


                    <Button htmlType='submit' className='register__btn'>Register</Button>
                </Form>
            </AuthenTemplate>
            <Footer />
        </div>
    );
}

export default RegisterPage;