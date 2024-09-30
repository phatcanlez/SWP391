// eslint-disable-next-line no-unused-vars
import { Button, Form, Image, Input, InputNumber, Modal, Popconfirm, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Upload from 'antd/es/upload/Upload';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import uploadFile from './util/file';
import api from '../../config/axios';

function CRUDTemplate({ columns, formItems, path }) {

    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formVariable] = useForm();
    const [loading, setLoading] = useState(false);
    const tableColumn = [
        ...columns,
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (id,path) => {
                <>
                    <Button
                        type='primary'
                        onClick={() => {
                            setShowModal(true);
                            formVariable.setFieldValue(path);
                        }}>
                        Edit
                    </Button>
                    <Popconfirm title="Delete" description="Do u want to delete?" onConfirm={() => handleDeteleOrder(id)}>
                        <Button type="primary" danger>Delete</Button>
                    </Popconfirm>
                </>

            },
        }
    ]

    const fetchData = async () => {
        const response = await axios.get(api)
        setData(response.data)
    }


    useEffect(() => { fetchData() }, [])


    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleOk = () => {
        formVariable.submit();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    const [submit, setSubmit] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true)
            if(values.id){
                const response = await api.put( `${path}/${values.id}`, values)
            }
            else{
                const response = await api.post(path, values)
            }
            toast.success('Successful')
            setIsModalOpen(false)
            formVariable.resetFields();
            fetchData();
        } catch (err) {
            toast.error(err);
        } finally {
            setSubmit(false)
        }
    }

    const handleDeteleOrder = async (dataID) => {
        try {
            await axios.delete(`${api}/${dataID}`);
            toast.success("Deleted!")
            fetchData();
        } catch (ex) {
            toast.error("Failed to delete");
        }
    };


    return (
        <div>
            <Button type="primary" onClick={showModal}>Add order</Button>
            <Table dataSource={data} columns={tableColumn} />;
            <Modal confirmLoading={submit} title="Add order form" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <Form onFinish={handleSubmit} form={formVariable}>
                    {formItems}
                </Form>
            </Modal>
            
        </div>
    )
}

export default CRUDTemplate
