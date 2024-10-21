import CRUDTemplate from "../../../components/crud-template";

function Payment() {
  const columns = [
    {
      title: "ID",
      dataIndex: "paymentId",
      key: "paymentId",
    },
    {
      title: "Time Of Pay",
      dataIndex: "timeOfPay",
      key: "timeOfPay",
    },
    {
      title: "Type Of Pay",
      dataIndex: "typeOfPay",
      key: "typeOfPay",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const formItems = <></>;

  return (
    <CRUDTemplate columns={columns} formItems={formItems} path="/payment" />
  );
}

export default Payment;
