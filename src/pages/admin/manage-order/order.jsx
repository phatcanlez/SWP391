import CRUDTemplate from "../../../components/crud-template";

function Order() {
  const columns = [];

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
