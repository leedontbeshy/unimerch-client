import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import type { 
  DashboardStats, 
  RecentActivity,
  RevenueAnalytics,
  PaymentMethodAnalytics,
  ProductAnalytics,
  SellerAnalytics,
  OrderAnalytics
} from '../../types/admin.types';
import { RefreshIcon } from '../../components/admin/Icons';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodAnalytics | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<ProductAnalytics | null>(null);
  const [sellerAnalytics, setSellerAnalytics] = useState<SellerAnalytics | null>(null);
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenuePeriod, setRevenuePeriod] = useState<'day' | 'week' | 'month'>('day');
  const [revenueDays, setRevenueDays] = useState(7);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (revenueData) {
      fetchRevenueData();
    }
  }, [revenuePeriod, revenueDays]);

  const fetchRevenueData = async () => {
    try {
      const revenue = await adminService.getRevenueAnalytics(revenuePeriod, revenueDays);
      setRevenueData(revenue);
    } catch (err) {
      console.error('Failed to fetch revenue data:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Fetch data with individual error handling
      const results = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getRecentActivity(10),
        adminService.getRevenueAnalytics('day', 7),
        adminService.getPaymentMethodStats().catch(() => null),
        adminService.getProductAnalytics(5),
        adminService.getSellerAnalytics(5).catch(() => null),
        adminService.getOrderAnalytics(),
      ]);

      // Extract successful results
      if (results[0].status === 'fulfilled') setStats(results[0].value);
      if (results[1].status === 'fulfilled') setActivities(results[1].value.activities);
      if (results[2].status === 'fulfilled') setRevenueData(results[2].value);
      if (results[3].status === 'fulfilled' && results[3].value) setPaymentMethods(results[3].value);
      if (results[4].status === 'fulfilled') setProductAnalytics(results[4].value);
      if (results[5].status === 'fulfilled' && results[5].value) setSellerAnalytics(results[5].value);
      if (results[6].status === 'fulfilled') setOrderAnalytics(results[6].value);

      // Check if critical data failed
      const criticalFailed = results[0].status === 'rejected' || results[2].status === 'rejected';
      if (criticalFailed) {
        setError('Một số dữ liệu quan trọng không thể tải. Vui lòng thử lại.');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải dữ liệu dashboard';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(parseFloat(value));
  };

  if (isLoading) {
    return (
      <div className="data-table-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!stats) return null;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered': return '👤';
      case 'order_created': return '🛒';
      case 'product_created': return '📦';
      case 'payment_completed': return '💳';
      default: return '📌';
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Bảng Điều Khiển</h1>
        <div className="page-actions">
          <button className="btn btn-secondary btn-small" onClick={fetchDashboardData}>
            <RefreshIcon /> Làm mới
          </button>
        </div>
      </div>

      {/* Header Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Tổng Doanh Thu"
          value={formatCurrency(stats.overview.total_revenue)}
          icon="💰"
          subtitle={`${stats.overview.successful_payments} thanh toán thành công`}
        />
        <StatCard
          title="Đơn Hàng"
          value={stats.overview.total_orders}
          icon="🛍️"
          subtitle={`${stats.overview.completed_orders} hoàn thành (${(stats.overview.conversion_rate ?? 0).toFixed(1)}%)`}
        />
        <StatCard
          title="Người Dùng"
          value={stats.overview.total_users}
          icon="👥"
          subtitle={`${stats.overview.total_sellers} người bán, ${stats.overview.total_admins} admin`}
        />
        <StatCard
          title="Sản Phẩm"
          value={stats.overview.total_products}
          icon="📦"
          subtitle={`${stats.overview.available_products} đang bán, ${stats.overview.total_categories} danh mục`}
        />
        <StatCard
          title="Giá Trị TB/Đơn"
          value={formatCurrency(stats.overview.average_order_value)}
          icon="💳"
          subtitle={`Tỷ lệ thanh toán: ${(stats.overview.payment_success_rate ?? 0).toFixed(1)}%`}
        />
        <StatCard
          title="Đánh Giá"
          value={stats.overview.total_reviews}
          icon="⭐"
          subtitle="Tổng đánh giá sản phẩm"
        />
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Revenue Chart */}
        {revenueData && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">📈 Doanh Thu 7 Ngày Qua</h2>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '16px', padding: '12px', background: '#1f2937', borderRadius: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '13px' }}>
                  <div>
                    <div style={{ color: '#9ca3af' }}>Tổng doanh thu</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                      {formatCurrency(revenueData.summary.total_revenue)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#9ca3af' }}>Đơn hoàn thành</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#e5e7eb' }}>
                      {revenueData.summary.completed_orders}/{revenueData.summary.total_orders}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#9ca3af' }}>Tỷ lệ chuyển đổi</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#3b82f6' }}>
                      {revenueData.summary.conversion_rate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Date Range Controls */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => { setRevenuePeriod('day'); setRevenueDays(7); }}
                    className={revenuePeriod === 'day' && revenueDays === 7 ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  >
                    7 ngày
                  </button>
                  <button
                    onClick={() => { setRevenuePeriod('day'); setRevenueDays(30); }}
                    className={revenuePeriod === 'day' && revenueDays === 30 ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  >
                    30 ngày
                  </button>
                  <button
                    onClick={() => { setRevenuePeriod('week'); setRevenueDays(12); }}
                    className={revenuePeriod === 'week' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  >
                    12 tuần
                  </button>
                  <button
                    onClick={() => { setRevenuePeriod('month'); setRevenueDays(12); }}
                    className={revenuePeriod === 'month' ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: '13px', padding: '6px 12px' }}
                  >
                    12 tháng
                  </button>
                </div>
                <button
                  onClick={fetchRevenueData}
                  className="btn btn-primary"
                  style={{ fontSize: '13px', padding: '6px 12px', marginLeft: 'auto' }}
                >
                  <RefreshIcon size={14} /> Làm mới
                </button>
              </div>

              {/* Line Chart */}
              <div style={{ position: 'relative', height: '320px', marginBottom: '16px', background: '#111827', borderRadius: '8px', padding: '16px' }}>
                <svg viewBox="0 0 800 300" style={{ width: '100%', height: '100%' }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line
                      key={i}
                      x1="50"
                      y1={i * 50 + 10}
                      x2="780"
                      y2={i * 50 + 10}
                      stroke="#374151"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                  
                  {(() => {
                    const dataPoints = revenueData.data.slice(0, revenueDays).reverse();
                    const maxRevenue = Math.max(...dataPoints.map(d => parseFloat(d.revenue)));
                    const chartWidth = 730;
                    const chartHeight = 240;
                    const xStep = chartWidth / (dataPoints.length - 1 || 1);
                    
                    return (
                      <>
                        {/* Area under line */}
                        <path
                          d={`M 50,260 ${dataPoints.map((item, index) => {
                            const x = 50 + (index * xStep);
                            const y = 260 - (parseFloat(item.revenue) / maxRevenue) * chartHeight;
                            return `L ${x},${y}`;
                          }).join(' ')} L ${50 + ((dataPoints.length - 1) * xStep)},260 Z`}
                          fill="url(#gradient)"
                          opacity="0.2"
                        />
                        
                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                          </linearGradient>
                        </defs>
                        
                        {/* Line */}
                        <polyline
                          points={dataPoints.map((item, index) => {
                            const x = 50 + (index * xStep);
                            const y = 260 - (parseFloat(item.revenue) / maxRevenue) * chartHeight;
                            return `${x},${y}`;
                          }).join(' ')}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        
                        {/* Data points and labels */}
                        {dataPoints.map((item, index) => {
                          const x = 50 + (index * xStep);
                          const y = 260 - (parseFloat(item.revenue) / maxRevenue) * chartHeight;
                          const showLabel = dataPoints.length <= 15 || index % Math.ceil(dataPoints.length / 10) === 0;
                          
                          return (
                            <g key={index}>
                              <circle cx={x} cy={y} r="4" fill="#10b981" stroke="white" strokeWidth="2" />
                              {showLabel && (
                                <>
                                  <text
                                    x={x}
                                    y="280"
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#9ca3af"
                                  >
                                    {new Date(item.period).toLocaleDateString('vi-VN', { 
                                      day: '2-digit', 
                                      month: '2-digit'
                                    })}
                                  </text>
                                  <title>{formatCurrency(item.revenue)}</title>
                                </>
                              )}
                            </g>
                          );
                        })}
                        
                        {/* Y-axis labels */}
                        {[0, 1, 2, 3, 4, 5].map((i) => {
                          const value = maxRevenue * (5 - i) / 5;
                          return (
                            <text
                              key={i}
                              x="5"
                              y={i * 50 + 15}
                              fontSize="10"
                              fill="#9ca3af"
                              textAnchor="start"
                            >
                              {value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`}
                            </text>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">💳 Phương Thức Thanh Toán</h2>
          </div>
          <div className="card-body">
            {paymentMethods ? (
              <>
              <div style={{ marginBottom: '16px', padding: '12px', background: '#1f2937', borderRadius: '8px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#9ca3af' }}>Tổng giao dịch</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#e5e7eb' }}>{paymentMethods.summary.total_transactions}</div>
                  </div>
                  <div>
                    <div style={{ color: '#9ca3af' }}>Tỷ lệ thành công</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                      {paymentMethods.summary.overall_success_rate}%
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {paymentMethods.payment_methods.slice(0, 5).map((method, index) => (
                  <div key={index} style={{ padding: '12px', background: '#111827', borderRadius: '8px', border: '1px solid #374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: '600', textTransform: 'uppercase', fontSize: '13px', color: '#e5e7eb' }}>
                          {method.payment_method}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {method.transaction_count} giao dịch
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: '#10b981', fontSize: '14px' }}>
                          {formatCurrency(method.total_amount)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {method.percentage_of_revenue}% doanh thu
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                      <span className="badge badge-success">{method.successful_count} thành công</span>
                      <span className="badge badge-error">{method.failed_count} thất bại</span>
                      <span className="badge badge-secondary">Tỷ lệ: {method.success_rate.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              </>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                <p>⚠️ Endpoint thống kê phương thức thanh toán chưa khả dụng</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Backend cần implement: GET /api/admin/stats/payment-methods</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status Analytics */}
      {orderAnalytics && (
        <div className="content-card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h2 className="card-title">📊 Phân Tích Trạng Thái Đơn Hàng</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {orderAnalytics.order_status_breakdown.map((status, index) => (
                <div key={index} style={{ 
                  padding: '16px', 
                  background: '#111827', 
                  borderRadius: '8px', 
                  border: '1px solid #374151',
                  borderLeft: `4px solid ${getStatusColor(status.status)}`
                }}>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                    {status.status_label}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px', color: '#e5e7eb' }}>
                    {status.count}
                  </div>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
                    {formatCurrency(status.total_amount)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#93c5fd', marginTop: '8px', fontWeight: '500' }}>
                    {status.percentage_of_orders}% đơn | {status.percentage_of_revenue}% doanh thu
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #3b82f6' }}>
              <div style={{ fontWeight: '600', marginBottom: '12px', color: '#93c5fd' }}>🎯 Conversion Funnel:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#dbeafe' }}>Pending → Processing:</span>
                  <span style={{ fontWeight: '600', marginLeft: '8px', color: '#dbeafe' }}>{orderAnalytics.conversion_funnel.pending_to_processing}%</span>
                </div>
                <div>
                  <span style={{ color: '#dbeafe' }}>Processing → Shipped:</span>
                  <span style={{ fontWeight: '600', marginLeft: '8px', color: '#dbeafe' }}>{orderAnalytics.conversion_funnel.processing_to_shipped}%</span>
                </div>
                <div>
                  <span style={{ color: '#dbeafe' }}>Shipped → Delivered:</span>
                  <span style={{ fontWeight: '600', marginLeft: '8px', color: '#dbeafe' }}>{orderAnalytics.conversion_funnel.shipped_to_delivered}%</span>
                </div>
                <div>
                  <span style={{ color: '#dbeafe' }}>Hoàn thành:</span>
                  <span style={{ fontWeight: '600', marginLeft: '8px', color: '#10b981' }}>{orderAnalytics.conversion_funnel.overall_completion}%</span>
                </div>
                <div>
                  <span style={{ color: '#dbeafe' }}>Tỷ lệ hủy:</span>
                  <span style={{ fontWeight: '600', marginLeft: '8px', color: '#fca5a5' }}>{orderAnalytics.conversion_funnel.cancellation_rate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tables Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Top Products */}
        {productAnalytics && productAnalytics.top_products.length > 0 && (
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">🏆 Top 5 Sản Phẩm Bán Chạy</h2>
            </div>
            <div className="card-body">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đã bán</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {productAnalytics.top_products.map((product, index) => (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '6px', 
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: '#6b7280'
                          }}>
                            {index + 1}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '13px' }}>{product.name}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>{product.category_name}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: '600' }}>{product.total_sold}</td>
                      <td style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(product.total_revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Sellers */}
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">👥 Top 5 Người Bán Xuất Sắc</h2>
          </div>
          <div className="card-body">
            {sellerAnalytics && sellerAnalytics.top_sellers.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Người bán</th>
                    <th>SP</th>
                    <th>Doanh thu</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerAnalytics.top_sellers.map((seller, index) => (
                    <tr key={seller.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '6px', 
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            color: '#6b7280'
                          }}>
                            {index + 1}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '13px' }}>{seller.full_name}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>@{seller.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>{seller.product_count}</td>
                      <td style={{ fontWeight: '600', color: '#10b981' }}>{formatCurrency(seller.total_revenue)}</td>
                      <td>
                        <span style={{ color: '#f59e0b' }}>⭐ {seller.avg_rating.toFixed(1)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                <p>⚠️ Endpoint thống kê người bán chưa khả dụng</p>
                <p style={{ fontSize: '12px', marginTop: '8px' }}>Backend cần implement: GET /api/admin/stats/sellers</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="content-card">
        <div className="card-header">
          <h2 className="card-title">🕒 Hoạt Động Gần Đây</h2>
        </div>
        <div className="card-body">
          {activities.length === 0 ? (
            <p className="data-table-empty">Chưa có hoạt động nào</p>
          ) : (
            <div className="activity-list">
              {activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-description">{activity.description}</p>
                    <p className="activity-time">{activity.time_ago}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
