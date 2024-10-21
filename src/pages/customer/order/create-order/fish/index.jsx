import { Form, InputNumber } from "antd"
import FormItem from "antd/es/form/FormItem";
import { useState, useEffect } from "react"
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import TextArea from "antd/es/input/TextArea";

function Fish() {
    const [fishCount, setFishCount] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [form] = Form.useForm();

    const props = {
        onChange({ file, fileList }) {
            if (file.status !== 'uploading') {
                console.log(file, fileList);
            }
        },
    }

    useEffect(() => {
        // Load saved data when component mounts
        const savedData = localStorage.getItem('fishFormData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            form.setFieldsValue(parsedData);
            setFishCount(parsedData.fishQuantity || 0);
            calculateTotalWeight(parsedData.fishDetails);
        }
    }, [form]);

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('fishFormData') || '{}');
        form.setFieldsValue({
            fishDetails: Array(fishCount).fill().map((_, index) => ({
                no: index + 1,
                weight: savedData.fishDetails?.[index]?.weight || null,
                size: savedData.fishDetails?.[index]?.size || null,
                note: savedData.fishDetails?.[index]?.note || null
            }))
        });
    }, [fishCount, form]);

    const calculateTotalWeight = (fishDetails) => {
        const total = (fishDetails || []).reduce((sum, fish) => sum + (fish.weight || 0), 0);
        setTotalWeight(total);
    };

    const handleFormChange = (changedValues, allValues) => {
        calculateTotalWeight(allValues.fishDetails);
        // Save form data to localStorage
        localStorage.setItem('fishFormData', JSON.stringify(allValues));
    };

    return(
        <div>
        <Form form={form} onValuesChange={handleFormChange} initialValues={JSON.parse(localStorage.getItem('fishFormData') || '{}')}>
            <Form.Item name="fishQuantity" label="Fish Quantity" rules={[{ required: true, message: 'Please enter Quantity' }]}>
                <InputNumber min={1} onChange={(value) => setFishCount(value || 0)} style={{width: '200px'}} />
            </Form.Item>

            <Form.List name="fishDetails">
                {(fields) => (
                    <>
                        {fields.map((field, index) => (
                            <div key={field.key} style={{ marginBottom: 16 }}>
                                <Form.Item
                                    {...field}
                                    label={`Fish #${index + 1}`}
                                    required={false}
                                    style={{ marginBottom: 0 }}
                                >
                                    <Form.Item
                                        name={[field.name, 'weight']}
                                        label={'Weight'}
                                        rules={[{ required: true, message: 'Please enter Weight' }]}
                                        style={{ display: 'inline-block', marginRight:'100px' }}
                                    >
                                        <InputNumber style={{width: '100px'}} placeholder="Weight (kg)" />
                                    </Form.Item>

                                    <Form.Item
                                        name={[field.name, 'size']}
                                        label={'Size'}
                                        rules={[{ required: true, message: 'Please enter Size' }]}
                                        style={{ display: 'inline-block', marginRight:'100px' }}
                                    >
                                        <InputNumber style={{width: '100px'}} placeholder="Size (cm)" />
                                    </Form.Item>

                                    <FormItem
                                        label={'Fish Image'}
                                        rules={[{ required: true, message: 'Please import Image' }]}
                                        style={{ display: 'inline-block', marginRight:'100px' }}
                                    >
                                        <Upload {...props}>
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </FormItem>

                                    <FormItem
                                        label={'Lisence Image'}
                                        rules={[{ required: true, message: 'Please import License' }]}
                                        style={{ display: 'inline-block', marginRight:'100px' }}
                                    >
                                        <Upload {...props}>
                                            <Button icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                    </FormItem>

                                    <Form.Item
                                        name={[field.name, 'note']}
                                        label={'Note'}
                                        style={{ display: 'inline-block', marginRight:'100px' }}
                                    >
                                        <TextArea rows={1} />
                                    </Form.Item>

                                </Form.Item>
                            </div>
                        ))}
                    </>
                )}
            </Form.List>

            <Form.Item label="Total Weight">
                <InputNumber
                    style={{width: '200px'}}
                    value={totalWeight}
                    readOnly
                    addonAfter="kg"
                />
            </Form.Item>
        </Form>
    </div>
    )
}

export default Fish
