import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Order } from '../types/order.types';
import { orderService } from '../services/orderService';
import '../css/orders.css';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND'
});

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
      setError(null);
    } catch {
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
    
    // Check for success message from navigation state
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleCancel = async (orderId: number) => {
    setActionLoadingId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      setSuccess(`Đơn hàng #${orderId} đã được hủy.`);
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể hủy đơn hàng này.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <p style={{ color: '#48d9a4', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Đơn hàng của tôi
          </p>
          <h1>Theo dõi trạng thái đơn hàng</h1>
          <p style={{ color: '#9aa5b1', margin: 0 }}>
            Kiểm tra lịch sử mua sắm và quản lý các đơn hàng gần đây.
          </p>
        </div>

        {error && <div className="orders-alert error">{error}</div>}
        {success && <div className="orders-alert success">{success}</div>}

        {isLoading ? (
          <div className="order-empty">Đang tải đơn hàng...</div>
        ) : orders.length === 0 ? (
          <div className="order-empty">
            Bạn chưa có đơn hàng nào. Hãy mua sắm và quay lại nhé!
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-info">
                  <h3>{order.orderNumber}</h3>
                  <span className={`status-pill status-${order.status}`}>{order.status}</span>
                  <span className="order-meta">Ngày đặt: {formatDate(order.orderDate)}</span>
                </div>

                <div className="order-info">
                  <span className="order-meta">Tổng tiền</span>
                  <strong>{currencyFormatter.format(order.totalAmount)}</strong>
                </div>

                <div className="order-actions">
                  <button
                    className="ghost-button"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Xem chi tiết
                  </button>
                  {order.status === 'pending' && (
                    <button
                      className="outline-button danger-button"
                      onClick={() => handleCancel(order.id)}
                      disabled={actionLoadingId === order.id}
                    >
                      {actionLoadingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrdersPage;


