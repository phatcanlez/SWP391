import CRUDTemplate from "../../../components/crud-template";

function Order() {
  const columns = [
    {
      title: "ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status Infomation",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        {
          {
            status.statusInfo;
          }
        }
      },
    },
  ];

  const formItems = <></>;

  return (
    <CRUDTemplate
      columns={columns}
      formItems={formItems}
      path="/orders"
      field="order"
    />
  );
}

export default Order;
