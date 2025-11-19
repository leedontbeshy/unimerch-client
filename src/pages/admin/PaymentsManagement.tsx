import React, { useEffect, useState, useCallback } from 'react';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import type { Payment, PaymentFilters } from '../../types/admin.types';
import { RefreshIcon } from '../../components/admin/Icons';

const PaymentsManagement: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_payments: 0,
  });
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    limit: 20,
    status: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminService.getPayments(filters);
      setPayments(response.payments);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải danh sách thanh toán';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsRefundModalOpen(true);
    setRefundReason('');
  };

  const confirmRefund = async () => {
    if (!selectedPayment || !refundReason.trim()) {
      setError('Vui lòng nhập lý do hoàn tiền');
      return;
    }

    try {
      await adminService.refundPayment(selectedPayment.id, refundReason);
      setIsRefundModalOpen(false);
      setSelectedPayment(null);
      setRefundReason('');
      fetchPayments();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể hoàn tiền';
      setError(message);
    }
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(parseFloat(value));
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'badge-warning',
      completed: 'badge-success',
      failed: 'badge-error',
      refunded: 'badge-secondary',
    };
    return badges[status] || 'badge-secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Chờ xử lý',
      completed: 'Hoàn thành',
      failed: 'Thất bại',
      refunded: 'Đã hoàn tiền',
    };
    return labels[status] || status;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cod: 'COD',
      credit_card: 'Thẻ tín dụng',
      debit_card: 'Thẻ ghi nợ',
      momo: 'MoMo',
      zalopay: 'ZaloPay',
      vnpay: 'VNPay',
      bank_transfer: 'Chuyển khoản',
      paypal: 'PayPal',
      stripe: 'Stripe',
    };
    return labels[method] || method;
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '60px',
    },
    {
      key: 'order_id',
      title: 'Mã ĐH',
      width: '80px',
      render: (id: number) => `#${id}`,
    },
    {
      key: 'payment_method',
      title: 'Phương thức',
      render: (method: string) => getMethodLabel(method),
    },
    {
      key: 'amount',
      title: 'Số tiền',
      render: (amount: string) => formatCurrency(amount),
    },
    {
      key: 'payment_status',
      title: 'Trạng thái',
      render: (status: string) => (
        <span className={`badge ${getStatusBadge(status)}`}>
          {getStatusLabel(status)}
        </span>
      ),
    },
    {
      key: 'transaction_id',
      title: 'Mã giao dịch',
      render: (id?: string) => id || '-',
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '100px',
      render: (_: unknown, payment: Payment) => (
        payment.payment_status === 'completed' ? (
          <button
            className="btn btn-danger btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleRefund(payment);
            }}
          >
            Hoàn tiền
          </button>
        ) : null
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý thanh toán</h1>
        <div className="page-actions">
          <button className="btn btn-secondary btn-small" onClick={fetchPayments}>
            <RefreshIcon /> Làm mới
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-card">
        <div className="filters-wrapper" style={{ padding: '24px 28px 0' }}>
          <div className="filter-group">
            <label className="filter-label">Trạng thái</label>
            <select
              className="filter-select"
              value={filters.status}
              onChange={handleStatusFilter}
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </div>
        </div>

        <div className="card-body">
          <DataTable
            columns={columns}
            data={payments}
            isLoading={isLoading}
            emptyMessage="Không tìm thấy giao dịch nào"
          />

          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Refund Modal */}
      <Modal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        title="Xác nhận hoàn tiền"
        size="medium"
      >
        {selectedPayment && (
          <div>
            <p>
              Bạn có chắc chắn muốn hoàn tiền cho giao dịch <strong>#{selectedPayment.id}</strong>?
            </p>
            <p style={{ color: 'var(--text-gray-light)', fontSize: '14px', marginTop: '8px' }}>
              Số tiền: {formatCurrency(selectedPayment.amount)}
            </p>

            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label form-label-required">Lý do hoàn tiền</label>
              <textarea
                className="form-input"
                rows={4}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Nhập lý do hoàn tiền..."
              />
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                onClick={() => setIsRefundModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmRefund}
                disabled={!refundReason.trim()}
              >
                Hoàn tiền
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PaymentsManagement;
