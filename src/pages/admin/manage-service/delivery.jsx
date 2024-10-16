import CRUDTemplate from "../../../components/crud-template";

function Delivery() {
  const columns = [
    {
      title: "ID",
      dataIndex: "shipMethodId",
      key: "shipMethodId",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const formItems = <></>;

  return (
    <CRUDTemplate columns={columns} formItems={formItems} path="/shipmethod" />
  );
}

export default Delivery;
