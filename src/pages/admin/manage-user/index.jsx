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
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
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
      title: "Password",
      dataIndex: "password",
      key: "password",
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
