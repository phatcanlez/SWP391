import CRUDTemplate from "../../../components/crud-template";
import { Checkbox, Form, Input } from "antd";

function ManageUser() {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        {
          text: "CUSTOMER",
          value: "CUSTOMER",
        },
        {
          text: "STAFF",
          value: "STAFF",
        },
        {
          text: "MANAGER",
          value: "MANAGER",
        },
      ],
      onFilter: (value, record) => record.role.indexOf(value) === 0,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <>
          <Checkbox checked={status} />
        </>
      ),
    },
    {
      title: "PhoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      key: "enabled",
      render: (enabled) => (
        <>
          <Checkbox checked={enabled} />
        </>
      ),
    },
  ];

  const formItems = (
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
    </>
  );

  return (
    <div>
      <CRUDTemplate columns={columns} formItems={formItems} path="/account" />
    </div>
  );
}

export default ManageUser;
