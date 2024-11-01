import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message, Spin } from 'antd';
import api from '../../../config/axios';

function PaymentCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const processPaymentResult = async () => {
            try {
                const orderData = JSON.parse(localStorage.getItem('currentOrderData'));
                const response = await api.post('/payment/verify', {
                    vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
                    vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
                    orderId: orderData.orderId
                });

                if (response.data.success) {
                    // Update order status
                    await api.put(`/orders/${orderData.orderId}`, {
                        status: 'paid'
                    });

                    message.success('Order created and payment completed successfully!');
                    localStorage.removeItem('currentOrderData');
                    localStorage.removeItem('fishFormData');
                    localStorage.removeItem('addressFormData');
                    localStorage.removeItem('priceFormData');
                    localStorage.removeItem('orderTotalPrice');
                } else {
                    message.error('Payment failed!');
                    // Update order status to payment failed
                    await api.put(`/orders/${orderData.orderId}`, {
                        status: 'payment_failed'
                    });
                }

                navigate('/customer-service/orders');
            } catch (error) {
                console.error('Payment verification error:', error);
                message.error('Payment verification failed!');
                navigate('/customer-service/orders');
            }
        };

        processPaymentResult();
    }, [searchParams, navigate]);

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <h2>Processing your payment...</h2>
            <p>Please do not close this window.</p>
        </div>
    );
}

export default PaymentCallback; 