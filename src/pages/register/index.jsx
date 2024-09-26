import React from 'react'
import AuthenTemplate from '../../components/authen-template';
import { DatePicker, Form, Input } from 'antd';
import { Button } from 'antd';
import Header from '../../components/header';
import Footer from '../../components/footer';
import '../register/register.css';
import { Link } from 'react-router-dom';
function RegisterPage() {
    return (
        <div>
            <Header />
            <AuthenTemplate>
                <h3>REGISTRATION</h3>
                <Form
                    labelCol={{
                        span: 24,
                    }}
                >
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
                        label="Full name"
                        name="fullname"
                        rules={[
                            { required: true, message: 'Please input your full name!' },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters long!' },
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
                        name="phone"
                        rules={[
                            { required: true, message: 'Please input your phone number!' },
                            {
                                pattern: /^((\+84)|0)([1-9]{1}[0-9]{8})$/,
                                message: 'Please enter a valid Vietnamese phone number!',
                            },
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

                    <Form.Item
                        label="Date of number"
                        name="DatePicker"
                        rules={[{ required: true, message: 'Please input!' }]}
                    >
                        <DatePicker className='date'/>
                    </Form.Item>
                </Form>
                <Button className='register__btn'>Register</Button>
            </AuthenTemplate>
            <Footer />
        </div>
    );
}

export default RegisterPage;