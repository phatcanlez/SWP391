
import {
    Button,
    Form,
    Input,
    InputNumber,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../../../config/axios';


const { TextArea } = Input;

function FormDisabledDemo() {
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        console.log(values);
        try {
            const response = await api.post("orders", values);
            console.log(response)
            toast.success("Successfull")
            navigate("/customer-service/delivery-method")
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    return (
        <>
            <h6>Information</h6>
            <Form onFinish={handleSubmit}
                labelCol={{
                    span: 10,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"

                style={{
                    maxWidth: 1000,
                }}
            >
                <Form.Item label="Oder ID" name="orderID">
                    <Input />
                </Form.Item>


                <Form.Item label="Your Address" name="senderAddress">
                    <Input />
                </Form.Item>

                <Form.Item label="Your Phone Number" name="senderPhoneNumber">
                    <Input />
                </Form.Item>


                <Form.Item label="Order's price" name="orderPrice">
                    <InputNumber />
                </Form.Item>

                <Form.Item label="Receiver's Name" name="reciverName">
                    <Input />
                </Form.Item>


                <Form.Item label="Receiver's Address" name="reciverAdress">
                    <Input />
                </Form.Item>

                <Form.Item label="Receiver's Phone Number" name="reciverPhoneNumber">
                    <Input />
                </Form.Item>


                <Form.Item label="Note">
                    <TextArea rows={1} />
                </Form.Item>



                <Button htmlType='submit'>Create</Button>

            </Form>
        </>
    );
};
export default FormDisabledDemo;