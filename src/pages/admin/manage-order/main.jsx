import Test01 from "./test";

function AllOrder_AD() {
  return (
    <div>
      <Test01 path={"/orders"} field="All" />
    </div>
  );
}

function FailOrder_AD() {
  return (
    <div>
      <Test01 path={`/orders/status?status=FAIL`} field="Status" />
    </div>
  );
}

function WaitingOrder_AD() {
  return (
    <div>
      <Test01 path={"orders/status?status=WAITING"} field="Status" />
    </div>
  );
}

function History_AD() {
  // const user = useSelector((store) => store);
  return (
    <div>
      <Test01 path={`orders/status?status=SUCCESS`} field="Status" />
    </div>
  );
}

function UnRefund_AD() {
  // const user = useSelector((store) => store);
  return (
    <div>
      <Test01 path={`orders/status?status=UNREFUND`} field="Status" />
    </div>
  );
}

function Refunded_AD() {
  // const user = useSelector((store) => store);
  return (
    <div>
      <Test01 path={`orders/status?status=REFUNDED`} field="Status" />
    </div>
  );
}

export default AllOrder_AD;
export { WaitingOrder_AD };
export { FailOrder_AD };
export { History_AD };
export { UnRefund_AD };
export { Refunded_AD };
