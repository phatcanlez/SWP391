import CRUDTemplate from "../../../components/crud-template";

function OrderDetails() {
  const columns = [];

  const formItems = <></>;

  return (
    <CRUDTemplate
      columns={columns}
      formItems={formItems}
      path="/orders-detail"
      field="order"
    />
  );
}

export default OrderDetails;
