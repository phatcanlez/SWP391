import { useParams } from "react-router-dom";

function OrderDetail() {
  const { id } = useParams();
  console.log(id);
  const fetchOrderDetail = async ()=>{
    
  }
  return <div>OrderDetail</div>;
}

export default OrderDetail;
