import { useSelector } from "react-redux";
import AdminOrder from "./template";

function AllOrder_AD() {
  return (
    <div>
      <AdminOrder path={"/orders"} isPaging />
    </div>
  );
}

function FailOrder_AD() {
  // const user = useSelector((store) => store);
  return (
    <div>
      <AdminOrder path={`/orders/status?status=FAIL`} />
    </div>
  );
}

function WaitingOrder_AD() {
  return (
    <div>
      <AdminOrder path={"orders/status?status=WAITING"} />
    </div>
  );
}

function History_AD() {
  // const user = useSelector((store) => store);
  return (
    <div>
      <AdminOrder path={`orders/status?status=SUCCESS`} />
    </div>
  );
}

function UnRefund_AD() {
  // const user = useSelector((store) => store);
  return (
    <div>
      <AdminOrder path={`orders/status?status=UNREFUND`} />
    </div>
  );
}

function Refunded_AD() {
  // const user = useSelector((store) => store);
  return (
    <div>
      <AdminOrder path={`orders/status?status=REFUNDED`} />
    </div>
  );
}

export default AllOrder_AD;
export { WaitingOrder_AD };
export { FailOrder_AD };
export { History_AD };
export { UnRefund_AD };
export { Refunded_AD };
