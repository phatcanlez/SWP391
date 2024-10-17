import CRUDTemplate from "../../../components/crud-template";

function PriceListDistance() {
  const columns = [
    {
      title: "ID",
      dataIndex: "priceListId",
      key: "priceListId",
    },
    {
      title: "Distance",
      dataIndex: "distance",
      key: "distance",
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
      path="/pricelistdistance"
    />
  );
}

export default PriceListDistance;
