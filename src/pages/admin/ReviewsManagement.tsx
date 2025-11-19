import React, { useEffect, useState, useCallback } from 'react';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Modal from '../../components/admin/Modal';
import { TrashIcon, RefreshIcon } from '../../components/admin/Icons';
import type { Review, ReviewFilters } from '../../types/admin.types';

const ReviewsManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_reviews: 0,
  });
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 20,
    rating: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminService.getReviews(filters);
      setReviews(response.reviews);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải danh sách đánh giá';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRatingFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ 
      ...prev, 
      rating: value ? parseInt(value) : undefined,
      page: 1 
    }));
  };

  const handleDelete = (review: Review) => {
    setSelectedReview(review);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedReview) return;

    try {
      await adminService.deleteReview(selectedReview.id);
      setIsDeleteModalOpen(false);
      setSelectedReview(null);
      fetchReviews();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xóa đánh giá';
      setError(message);
      setIsDeleteModalOpen(false);
      setSelectedReview(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '60px',
    },
    {
      key: 'product_name',
      title: 'Sản phẩm',
      render: (_: any, review: Review) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {review.product_name}
        </div>
      ),
    },
    {
      key: 'user_full_name',
      title: 'Người dùng',
      render: (_: any, review: Review) => (
        <div>
          <div style={{ fontWeight: '500' }}>{review.user_full_name}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>@{review.username}</div>
        </div>
      ),
    },
    {
      key: 'rating',
      title: 'Đánh giá',
      render: (_: any, review: Review) => (
        <span style={{ color: '#f59e0b', fontSize: '16px' }}>
          {renderStars(review.rating)}
        </span>
      ),
    },
    {
      key: 'comment',
      title: 'Nhận xét',
      render: (_: any, review: Review) => (
        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {review.comment || '-'}
        </div>
      ),
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      render: (_: any, review: Review) => formatDate(review.created_at),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '100px',
      render: (_: any, review: Review) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            className="btn btn-danger btn-icon btn-small"
            onClick={() => handleDelete(review)}
            title="Xóa"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý đánh giá</h1>
        <div className="page-actions">
          <button className="btn btn-secondary btn-small" onClick={fetchReviews}>
            <RefreshIcon /> Làm mới
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-card">
        <div className="filters-wrapper" style={{ padding: '24px 28px 0' }}>
          <div className="filter-group">
            <label className="filter-label">Lọc theo đánh giá</label>
            <select
              className="filter-select"
              value={filters.rating || ''}
              onChange={handleRatingFilter}
            >
              <option value="">Tất cả</option>
              <option value="5">5 sao ★★★★★</option>
              <option value="4">4 sao ★★★★☆</option>
              <option value="3">3 sao ★★★☆☆</option>
              <option value="2">2 sao ★★☆☆☆</option>
              <option value="1">1 sao ★☆☆☆☆</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={reviews}
          isLoading={isLoading}
          emptyMessage="Chưa có đánh giá nào"
        />

        {pagination.total_pages > 1 && (
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedReview(null);
        }}
        title="Xác nhận xóa"
      >
        <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
        {selectedReview && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
            <p><strong>Sản phẩm:</strong> {selectedReview.product_name}</p>
            <p><strong>Người dùng:</strong> {selectedReview.user_full_name} (@{selectedReview.username})</p>
            <p><strong>Đánh giá:</strong> <span style={{ color: '#f59e0b' }}>{renderStars(selectedReview.rating)}</span></p>
            <p><strong>Nhận xét:</strong> {selectedReview.comment || '-'}</p>
          </div>
        )}
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedReview(null);
            }}
          >
            Hủy
          </button>
          <button className="btn btn-danger" onClick={confirmDelete}>
            Xóa
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ReviewsManagement;
