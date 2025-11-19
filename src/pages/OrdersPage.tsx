import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../types/order.types';
import { orderService } from '../services/orderService';
import Header from '../components/Header';
import '../css/orders.css';

const STATUS_TABS = [
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'Processing', label: 'Vận chuyển' },
  { value: 'Shipped', label: 'Chờ giao hàng' },
  { value: 'Delivered', label: 'Hoàn thành' },
  { value: 'Cancelled', label: 'Đã huỷ' }
];

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
  const [tab, setTab] = useState<string>('Pending');
  const navigate = useNavigate();

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
  }, []);

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

  // Count by status
  const counts = STATUS_TABS.reduce((acc, s) => {
    acc[s.value] = orders.filter(o => o.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  // Filtered orders for active tab
  const filteredOrders = orders.filter(order => {
    if (tab === 'Pending') return order.status === 'Pending';
    if (tab === 'Processing') return order.status === 'Processing';
    if (tab === 'Shipped') return order.status === 'Shipped';
    if (tab === 'Delivered') return order.status === 'Delivered';
    if (tab === 'Cancelled') return order.status === 'Cancelled';
    return true;
  });

  return (

    <section className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <Header showAuthButtons={false} />
          <h1>Đơn hàng của tôi</h1>
        </div>

        {/* Tabs with numbers */}
        <div style={{ display: 'flex', background: 'rgba(24,42,51,0.57)', borderRadius: 18, overflow: 'hidden', marginBottom: 32 }}>
          {STATUS_TABS.map((s, i) => (
            <button
              key={s.value}
              style={{
                flex: 1,
                padding: '30px 10px',
                border: 'none',
                background: tab === s.value ? 'rgba(20,184,166,.14)' : 'transparent',
                color: tab === s.value ? '#14b8a6' : '#c0cbd4',
                fontWeight: 700,
                fontSize: 17,
                outline: 'none',
                borderBottom: tab === s.value ? '4px solid #14b8a6' : '4px solid transparent',
                borderRight: i < STATUS_TABS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                letterSpacing: 0.01
              }}
              onClick={() => setTab(s.value)}
            >
              {s.label}
              <span style={{ fontSize: '1.14em', marginTop: 5, fontWeight: 800, background: 'rgba(18,24,51,0.14)', borderRadius: 99, minWidth: 34, display: 'inline-block', color: tab === s.value ? '#14b8a6' : '#5eead4' }}>{counts[s.value] ?? 0}</span>
            </button>
          ))}
        </div>

        {error && <div className="orders-alert error">{error}</div>}
        {success && <div className="orders-alert success">{success}</div>}

        {isLoading ? (
          <div className="order-empty">Đang tải đơn hàng...</div>
        ) :
          filteredOrders.length === 0 ? (
            <div className="order-empty">
              Không có đơn hàng nào ở trạng thái này.
            </div>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => (
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
                    {order.status === 'Pending' && (
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


