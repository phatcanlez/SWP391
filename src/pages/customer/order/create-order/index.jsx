import {
    Button,
    Form,
    Input,
    InputNumber,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../../config/axios';
import { Steps } from 'antd';
import { useState, useRef, useEffect } from 'react';
import Address from './address';
import Fish from './fish';
import Price from './price';
import Payment from './payment';



const { TextArea } = Input;
const { Step } = Steps;

function FormDisabledDemo() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const formRefs = useRef([]);
    const [stepData, setStepData] = useState({});

    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const response = await api.post("orders", values);
            console.log(response)
            toast.success("Successful")
            navigate("/customer-service/delivery-method")
        } catch (err) {
            toast.error(err.response?.data || "An error occurred")
        }
    }

    const steps = [
        {
            title: 'Information',
            content: (
                <Address ref={(el) => (formRefs.current[0] = el)} />
            ),
        },
        {
            title: 'Fish',
            content: (
                <Fish ref={(el) => (formRefs.current[1] = el)} />
            ),
        },
        {
            title: 'Price',
            content: (
                <Price ref={(el) => (formRefs.current[1] = el)} />
            ),
        },
        {
            title: 'Payment',
            content: (
                <Payment ref={(el) => (formRefs.current[3] = el)} />
            ),
        },
    ];

    useEffect(() => {
        // Load saved data when component mounts
        const savedData = localStorage.getItem('orderFormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setStepData(parsedData);
            formRefs.current.forEach((formRef, index) => {
                if (formRef && formRef.setFieldsValue) {
                    formRef.setFieldsValue(parsedData);
                }
            });
        }
    }, []);

    useEffect(() => {
        const currentForm = formRefs.current[current];
        if (currentForm && currentForm.setFieldsValue) {
            currentForm.setFieldsValue(stepData);
        }
    }, [current, stepData]);

    const next = async () => {
        const currentForm = formRefs.current[current];
        if (currentForm) {
            try {
                const values = await currentForm.validateFields();
                setStepData(prevData => {
                    const newData = { ...prevData, ...values };
                    localStorage.setItem('orderFormData', JSON.stringify(newData));
                    return newData;
                });
                if (current === steps.length - 1) {
                    //last step, submit the form
                    await handleSubmit(stepData);
                } else {
                    setCurrent(current + 1);
                }
            } catch (errorInfo) {
                console.log('Validation failed:', errorInfo);
                toast.error("Please fill in all information before continuing.");
            }
        } else {
            setCurrent(current + 1);
        }
    };

    const prev = () => {
        const currentForm = formRefs.current[current];
        if (currentForm) {
            const values = currentForm.getFieldsValue();
            setStepData(prevData => {
                const newData = { ...prevData, ...values };
                localStorage.setItem('orderFormData', JSON.stringify(newData));
                return newData;
            });
        }
        setCurrent(current - 1);
    };

    return (
        <Form form={form} onFinish={handleSubmit}>
            <h6>Create Order</h6>
            <div>
                <Steps current={current}>
                    {steps.map(step => (
                        <Step key={step.title} title={step.title} />
                    ))}
                </Steps>
                <div style={{ marginTop: 24 }}>
                    <div>{steps[current].content}</div>
                    <div style={{ marginTop: 16 }}>
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={next}>
                                Finish
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={prev}>
                                Previous
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Form>
    );
};

export default FormDisabledDemo;
