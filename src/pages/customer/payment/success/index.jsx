// import { Button, Result } from "antd";
// import api from "../../config/axios";
// import { toast } from "react-toastify";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function SuccessPage() {
//   const params = useGetParams();
//   console.log(params)
//   const orderID = params("orderID");
//   console.log(orderID);
//   const vnp = params("vnp_TransactionStatus");
//   console.log(vnp);
//   const navigate = useNavigate();

//   const postOrderID = async () => {
//     try {
//       const response = await api.put(`payment-status?orderId=${orderID}`);
//     } catch (error) {
//       toast.error(error);
//     }
//   };

//   useEffect(() => {
//     if (vnp === "00") {
//       postOrderID();
//     } else {
//       ///that bai
//     }
//   }, []);

//   return (
//     <div>
//       <Result
//         status="success"
//         title="Payment Successfully!"
//         subTitle="Cloud server configuration takes 1-5 minutes, please wait."
//         extra={[
//           <Button
//             type="primary"
//             key="console"
//             onClick={() => {
//               navigate("/history");
//             }}
//           >
//             Go Order History
//           </Button>
//         ]}
//       />
//     </div>
//   );
// }

// export default SuccessPage;