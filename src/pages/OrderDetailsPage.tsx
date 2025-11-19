import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Order } from '../types/order.types';
import { orderService } from '../services/orderService';
import '../css/orders.css';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError('Thiếu mã đơn hàng.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await orderService.getOrderById(Number(id));
        setOrder(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải chi tiết đơn hàng.');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchOrder();
  }, [id]);

  return (
    <section className="order-details-page">
      <div className="order-details-container">
        <Link to="/orders" className="back-link">
          ← Quay lại danh sách
        </Link>

        {error && <div className="orders-alert error">{error}</div>}

        {isLoading ? (
          <div className="order-empty">Đang tải thông tin đơn hàng...</div>
        ) : !order ? (
          <div className="order-empty">Không tìm thấy đơn hàng phù hợp.</div>
        ) : (
          <>
            <div className="orders-header">
              <p style={{ color: '#48d9a4', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Chi tiết đơn hàng
              </p>
              <h1>{order.orderNumber}</h1>
              <span className={`status-pill status-${order.status}`}>{order.status}</span>
            </div>

            <div className="order-details-grid">
              <div className="detail-card">
                <h4>Thông tin chung</h4>
                <p>Mã đơn nội bộ: #{order.id}</p>
                <p>Ngày đặt: {formatDate(order.orderDate)}</p>
              </div>
              <div className="detail-card">
                <h4>Thanh toán</h4>
                <p>Tổng tiền</p>
                <strong style={{ fontSize: '1.2rem' }}>
                  {currencyFormatter.format(order.totalAmount)}
                </strong>
              </div>
            </div>

            <div className="detail-card">
              <h4>Sản phẩm trong đơn</h4>
              <div className="order-items-list">
                {order.items.map((item) => (
                  <div className="order-item-row" key={item.productId}>
                    <div className="item-info">
                      <strong>{item.name}</strong>
                      <span className="item-qty">Số lượng: {item.quantity}</span>
                    </div>
                    <div>
                      <p style={{ margin: 0 }}>
                        {currencyFormatter.format(item.price * item.quantity)}
                      </p>
                      <small style={{ color: '#9aa5b1' }}>
                        {currencyFormatter.format(item.price)} / sản phẩm
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderDetailsPage;


