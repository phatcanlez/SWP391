import { Button, Form, Input, Modal, Popconfirm, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import api from '../../config/axios';

function CRUDTemplate({ columns, formItems, path }) {
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false);
    const tableColumn = [
        ...columns,
        {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (id, category) => (
                <>
                    <Button type='primary' onClick={() => {
                        showModal(true);
                        form.setFieldValue(category)
                    }}>Edit</Button>


                    <Popconfirm title="Delete" description="Do you want to delete" onConfirm={() => { handleDelete(id) }}>
                        <Button type='primary' danger>
                            Delete
                        </Button>
                    </Popconfirm>

                </>
            ),
        },

    ]
    //get
    const fetchData = async () => {
        try {
            const response = await api.get(path)
            setData(response.da)
        } catch (err) {
            toast.error(err.response.data)
        }
    }

    //create or update
    const handleSubmit = async (values) => {
        console.log(values);
        try {
            setLoading(true);
            if (values.id) {
                const response = await api.put(`${path}/${values.id}`, values);
            } else {
                const response = await api.post(path, values);
            }

            toast.success("Successfull");
            fetchData();
            form.resetFields();
            setShowModal(false);
        } catch (err) {
            toast.error(err.response.data);
        } finally {
            setLoading(false)
        }
    }

    //delete
    const handleDelete = async (id) => {
        try {
            await api.delete(`${path}/${id}`);
            toast.success("Successful")
            fetchData();
        } catch (err) {
            toast.error(err.response.data);
        }
    }


    useEffect(() => { fetchData(); }, [])



    return (
        <div>
            <Button onClick={() => setShowModal(true)}>Add</Button>
            <Table dataSource={data} columns={tableColumn} />

            <Modal open={showModal} onCancel={() => setShowModal(false)} title="Category" onOk={() => form.submit()} confirmLoading={loading}>
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
                    {formItems}
                </Form>
            </Modal>
        </div>
    )
}

export default CRUDTemplate