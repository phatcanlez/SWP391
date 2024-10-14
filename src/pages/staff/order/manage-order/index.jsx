import StaffOrder from "../../../../components/staff/order-template";

function AllOrder() {
  return (
    <div>
      <StaffOrder path={"/orders"} />
    </div>
  );
}

function ProcessingOrder() {
  return (
    <div>
      <StaffOrder path={"/orders"} />
    </div>
  );
}

function WaitingOrder() {
  return (
    <div>
      
      <StaffOrder path={"/orders/status?status=WAITING"} />
    </div>
  );
}

export default AllOrder;
export { ProcessingOrder };
export { WaitingOrder };
