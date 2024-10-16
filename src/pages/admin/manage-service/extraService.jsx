import CRUDTemplate from "../../../components/crud-template";

function ExtraService() {
  const columns = [
    {
      title: "ID",
      dataIndex: "extraServiceId",
      key: "extraServiceId",
    },
    {
      title: "Service name",
      dataIndex: "nameService",
      key: "nameService",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const formItems = <></>;

  return (
    <CRUDTemplate
      columns={columns}
      formItems={formItems}
      path="/extraservice"
    />
  );
}

export default ExtraService;
