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

function WaitingOversea() {
  return (
    <div>
      <StaffOrder path={`orders/status-type?status=WAITING&type=OVERSEA`} />
    </div>
  );
}

function Waiting2ndStaff() {
  return (
    <div>
      <StaffOrder
        path={`orders/status-type?status=WATINGFOR2NDSTAFF&type=OVERSEA`}
      />
    </div>
  );
}

function WaitingDomestic() {
  return (
    <div>
      <StaffOrder path={`orders/status-type?status=WAITING&type=DOMESTIC`} />
    </div>
  );
}

function WaitingFor2ndStaff() {
  const user = useSelector((store) => store);
  return (
    <div>
      <StaffOrder isWaiting  path={`orders/waiting-for-2nd-staff?empId=${user.user.id}` } />
    </div>
  );
}

export default AllOrder;
export { WaitingOrder };
export { FailOrder };
export { History };
export { Waiting2ndStaff };
export { WaitingOversea };
export { WaitingDomestic };
export { WaitingFor2ndStaff };
