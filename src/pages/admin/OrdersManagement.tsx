import React, { useEffect, useState, useCallback } from 'react';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import { EyeIcon, EditIcon, RefreshIcon } from '../../components/admin/Icons';
import type { Order, OrderFilters } from '../../types/admin.types';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_orders: 0,
  });
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 20,
    status: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminService.getOrders(filters);
      setOrders(response.orders);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải danh sách đơn hàng';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleViewDetails = async (order: Order) => {
    try {
      const fullOrder = await adminService.getOrderById(order.id);
      setSelectedOrder(fullOrder);
      setIsDetailsModalOpen(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải chi tiết đơn hàng';
      setError(message);
    }
  };

  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsEditStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      setError('');
      await adminService.updateOrderStatus(selectedOrder.id, newStatus);
      setIsEditStatusModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: unknown) {
      // Close modal first to show error message
      setIsEditStatusModalOpen(false);
      setSelectedOrder(null);
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng';
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const getValidNextStatuses = (currentStatus: string): string[] => {
    const statusFlow: Record<string, string[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: [],
    };
    return statusFlow[currentStatus] || [];
  };

  const getAllStatuses = (): string[] => {
    return ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-info',
      delivered: 'badge-success',
      cancelled: 'badge-error',
    };
    return badges[status] || 'badge-secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return labels[status] || status;
  };

  const columns = [
    {
      key: 'id',
      title: 'Mã ĐH',
      width: '80px',
      render: (id: number) => `#${id}`,
    },
    {
      key: 'user_id',
      title: 'User ID',
      width: '80px',
    },
    {
      key: 'total_amount',
      title: 'Tổng tiền',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      key: 'payment_method',
      title: 'Thanh toán',
      render: (method: string) => method.toUpperCase(),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (status: string) => (
        <span className={`badge ${getStatusBadge(status)}`}>
          {getStatusLabel(status)}
        </span>
      ),
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '160px',
      render: (_: unknown, order: Order) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-icon btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(order);
            }}
            title="Chi tiết"
          >
            <EyeIcon size={16} />
          </button>
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <button
              className="btn btn-warning btn-icon btn-small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditStatus(order);
              }}
              title="Cập nhật trạng thái"
            >
              <EditIcon size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý đơn hàng</h1>
        <div className="page-actions">
          <button className="btn btn-secondary btn-small" onClick={fetchOrders}>
            <RefreshIcon /> Làm mới
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-card">
        <div className="filters-wrapper" style={{ padding: '24px 28px 0' }}>
          <div className="filter-group">
            <label className="filter-label">Trạng thái đơn hàng</label>
            <select
              className="filter-select"
              value={filters.status}
              onChange={handleStatusFilter}
            >
              <option value="">Tất cả trạng thái</option>
              {getAllStatuses().map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="card-body">
          <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading}
            emptyMessage="Không tìm thấy đơn hàng nào"
          />

          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        size="large"
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: 'var(--text-white)', marginBottom: '16px' }}>
                Thông tin đơn hàng
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <strong>User ID:</strong> {selectedOrder.user_id}
                </div>
                <div>
                  <strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.total_amount)}
                </div>
                <div>
                  <strong>Địa chỉ giao hàng:</strong> {selectedOrder.shipping_address}
                </div>
                <div>
                  <strong>Phương thức thanh toán:</strong>{' '}
                  {selectedOrder.payment_method.toUpperCase()}
                </div>
                <div>
                  <strong>Trạng thái:</strong>{' '}
                  <span className={`badge ${getStatusBadge(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <strong>Ngày tạo:</strong>{' '}
                  {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                </div>
                {selectedOrder.updated_at && (
                  <div>
                    <strong>Cập nhật lần cuối:</strong>{' '}
                    {new Date(selectedOrder.updated_at).toLocaleString('vi-VN')}
                  </div>
                )}
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div>
                <h3 style={{ color: 'var(--text-white)', marginBottom: '16px' }}>
                  Sản phẩm ({selectedOrder.items.length} mặt hàng)
                </h3>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tên sản phẩm</th>
                      <th style={{ width: '100px', textAlign: 'center' }}>Số lượng</th>
                      <th style={{ width: '150px', textAlign: 'right' }}>Đơn giá</th>
                      <th style={{ width: '150px', textAlign: 'right' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(item.price)}</td>
                        <td style={{ textAlign: 'right' }}>
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '2px solid var(--border-color)' }}>
                      <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        Tổng cộng:
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {formatCurrency(selectedOrder.total_amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={isEditStatusModalOpen}
        onClose={() => setIsEditStatusModalOpen(false)}
        title={`Cập nhật trạng thái đơn hàng #${selectedOrder?.id}`}
        size="small"
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong>Trạng thái hiện tại:</strong>{' '}
                <span className={`badge ${getStatusBadge(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="order-status">Chọn trạng thái mới *</label>
                <select
                  id="order-status"
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {getAllStatuses().map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                      {status === selectedOrder.status ? ' (Hiện tại)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(0, 229, 204, 0.05)', border: '1px solid rgba(0, 229, 204, 0.2)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-gray)' }}>
                <div style={{ marginBottom: '6px', fontWeight: '600', color: 'var(--neon-cyan)' }}>Quy trình cập nhật:</div>
                <div>• Chờ xử lý → Đang xử lý / Đã hủy</div>
                <div>• Đang xử lý → Đã gửi / Đã hủy</div>
                <div>• Đã gửi → Đã giao / Đã hủy</div>
                <div style={{ marginTop: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>⚠️ Trạng thái "Đã giao" và "Đã hủy" không thể thay đổi</div>
              </div>

              {getValidNextStatuses(selectedOrder.status).length === 0 && (
                <div className="alert alert-info" style={{ marginTop: '16px' }}>
                  ⓘ Đơn hàng đã ở trạng thái cuối cùng, không thể cập nhật.
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditStatusModalOpen(false)}
                disabled={isUpdating}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateStatus}
                disabled={
                  isUpdating ||
                  newStatus === selectedOrder.status ||
                  getValidNextStatuses(selectedOrder.status).length === 0
                }
              >
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrdersManagement;
