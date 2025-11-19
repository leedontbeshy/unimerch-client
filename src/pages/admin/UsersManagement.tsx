import React, { useEffect, useState, useCallback } from 'react';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import SearchBar from '../../components/admin/SearchBar';
import Modal from '../../components/admin/Modal';
import { EditIcon, TrashIcon, RefreshIcon } from '../../components/admin/Icons';
import type { User, UserFilters } from '../../types/admin.types';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 20,
    search: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    studentId: '',
    phone: '',
    address: '',
    role: 'user' as 'user' | 'seller' | 'admin',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminService.getUsers(filters);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải danh sách người dùng';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      fullName: user.fullName || '',
      studentId: user.studentId || '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      setError('');
      await adminService.updateUser(selectedUser.id, editFormData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật người dùng';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await adminService.deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: unknown) {
      // Close modal first to show error message
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xóa người dùng';
      setError(message);
    }
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      admin: 'badge-error',
      seller: 'badge-warning',
      user: 'badge-info',
    };
    return badges[role] || 'badge-secondary';
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '60px',
    },
    {
      key: 'username',
      title: 'Username',
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'fullName',
      title: 'Họ tên',
    },
    {
      key: 'role',
      title: 'Vai trò',
      render: (role: string) => (
        <span className={`badge ${getRoleBadge(role)}`}>
          {role === 'admin' ? 'Admin' : role === 'seller' ? 'Seller' : 'User'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_: unknown, user: User) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-icon btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(user);
            }}
            title="Sửa"
          >
            <EditIcon size={16} />
          </button>
          <button
            className="btn btn-danger btn-icon btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(user);
            }}
            title="Xóa"
          >
            <TrashIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý người dùng</h1>
        <div className="page-actions">
          <button className="btn btn-secondary btn-small" onClick={fetchUsers}>
            <RefreshIcon /> Làm mới
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-card">
        <div className="card-header">
          <SearchBar onSearch={handleSearch} placeholder="Tìm theo username, email, họ tên..." />
        </div>

        <div className="card-body">
          <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="Không tìm thấy người dùng nào"
          />

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Chỉnh sửa người dùng: ${selectedUser?.username}`}
        size="medium"
      >
        <form onSubmit={handleEditSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                value={editFormData.fullName}
                onChange={handleEditFormChange}
                required
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="studentId">Mã sinh viên</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                className="form-control"
                value={editFormData.studentId}
                onChange={handleEditFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={editFormData.phone}
                onChange={handleEditFormChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Vai trò *</label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={editFormData.role}
                onChange={handleEditFormChange}
                required
              >
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <textarea
                id="address"
                name="address"
                className="form-control"
                rows={3}
                value={editFormData.address}
                onChange={handleEditFormChange}
              />
            </div>
          </div>

          <div className="form-info">
            <p><strong>Email:</strong> {selectedUser?.email}</p>
            <p><strong>Username:</strong> {selectedUser?.username}</p>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Xác nhận xóa"
        size="small"
      >
        <p>Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.username}</strong>?</p>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
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

export default UsersManagement;
