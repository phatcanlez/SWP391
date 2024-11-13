import { useSelector } from "react-redux";
import StaffOrder from "../../../../components/staff/order-template";

function AllOrder() {
  return (
    <div>
      <StaffOrder path={"/orders"} isPaging />
    </div>
  );
}

function FailOrder() {
  const user = useSelector((store) => store);
  return (
    <div>
      <StaffOrder
        path={`/orders/status-emp?status=FAIL&empId=${user.user.id}`}
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

function History() {
  const user = useSelector((store) => store);
  return (
    <div>
      <StaffOrder
        path={`orders/status-emp?status=SUCCESS&empId=${user.user.id}`}
      />
    </div>
  );
}

export default AllOrder;
export { WaitingOrder };
export { FailOrder };
export { History };
