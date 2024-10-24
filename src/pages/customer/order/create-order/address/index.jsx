import  { forwardRef, useImperativeHandle } from 'react';
import { Form, Input } from "antd"
import TextArea from "antd/es/input/TextArea"
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState} from 'react';

// eslint-disable-next-line react/display-name
const Address = forwardRef((props, ref) => {
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
        validateFields: () => form.validateFields(),
        getFieldsValue: () => form.getFieldsValue(),
        setFieldsValue: (values) => form.setFieldsValue(values),
    }));
    const [selectedLocation, setSelectedLocation] = useState(null);
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setSelectedLocation({ lat, lng });
        form.setFieldsValue({
            senderAddress: `Lat: ${lat}, Lng: ${lng}`,
        });
    };

    return(
        <Form 
            form={form}
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
            <div> Sender Information</div>
            <Form.Item 
                label="Phone Number" 
                name="senderPhoneNumber"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item 
                label="Address" 
                name="senderAddress"
                rules={[{ required: true, message: 'Please input your address!' }]}
            >
                <LoadScript googleMapsApiKey="GOOGLE_MAPS_API_KEY">
                    <GoogleMap
                        mapContainerStyle={{ height: "400px", width: "100%" }}
                        center={{ lat: 10.762622, lng: 106.660172 }} // Ho Chi Minh City coordinates
                        zoom={10}
                        onClick={handleMapClick}
                    >
                        {selectedLocation && <Marker position={selectedLocation} />}
                    </GoogleMap>
                </LoadScript>
                <Input />
            </Form.Item>

            <div> Receiver Information</div>
            <Form.Item 
                label="Receiver's Name" 
                name="receiverName"
                rules={[{ required: true, message: 'Please input receiver\'s name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item 
                label="Phone Number" 
                name="receiverPhoneNumber"
                rules={[{ required: true, message: 'Please input receiver\'s phone number!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item 
                label="Address" 
                name="receiverAddress"
                rules={[{ required: true, message: 'Please input receiver\'s address!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item 
                label="Note" 
                name="note"
            >
                <TextArea rows={1} />
            </Form.Item>
        </Form>
    )
});

export default Address;
