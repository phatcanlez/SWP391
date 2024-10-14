import {  useSelector } from "react-redux";
import StaffOrder from "../../../../components/staff/order-template";

function AllOrder() {
  return (
    <div>
      <StaffOrder path={"/orders"} />
    </div>
  );
}

function ProcessingOrder() {
  const user = useSelector((store) => store);
  return (
    <div>
      <StaffOrder
        path={`/orders/status-emp?status=APPROVED&empId=${user.user.id}`}
      />
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
