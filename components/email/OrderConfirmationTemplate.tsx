import * as React from 'react';

interface OrderConfirmationTemplateProps {
    orderId: string;
    customerName: string;
    amount: number;
}

export const OrderConfirmationTemplate: React.FC<Readonly<OrderConfirmationTemplateProps>> = ({
    orderId,
    customerName,
    amount,
}) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h1>Thank you for your order!</h1>
        <p>Hi {customerName},</p>
        <p>We verified your payment and your order is being processed.</p>

        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Total Amount:</strong> ${(amount / 100).toFixed(2)}</p>
        </div>

        <p>You can view your order status in your <a href="http://localhost:3000/orders">Order History</a>.</p>

        <p>Best regards,<br />The Team</p>
    </div>
);
