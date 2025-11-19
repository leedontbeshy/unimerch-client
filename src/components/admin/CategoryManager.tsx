import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import Modal from './Modal';
import type { Category } from '../../types/admin.types';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryChange?: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ isOpen, onClose, onCategoryChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminService.getCategories();
      // Handle response safely
      if (response && response.categories) {
        setCategories(response.categories);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải danh sách danh mục';
      setError(message);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ name: '', description: '' });
    setIsAddModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      await adminService.createCategory(formData);
      setIsAddModalOpen(false);
      fetchCategories();
      onCategoryChange?.();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tạo danh mục';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      setIsSubmitting(true);
      setError('');
      await adminService.updateCategory(selectedCategory.id, formData);
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
      onCategoryChange?.();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật danh mục';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await adminService.deleteCategory(selectedCategory.id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
      onCategoryChange?.();
    } catch (err: unknown) {
      // Close modal first to show error message
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xóa danh mục';
      setError(message);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Quản lý danh mục" size="large">
        <div style={{ marginBottom: '20px' }}>
          <button className="btn btn-primary btn-small" onClick={handleAdd}>
            <PlusIcon /> Thêm danh mục
          </button>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '16px' }}>{error}</div>}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th style={{ width: '120px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>
                      Chưa có danh mục nào
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>{category.description || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-secondary btn-icon btn-small"
                            onClick={() => handleEdit(category)}
                            title="Sửa"
                          >
                            <EditIcon />
                          </button>
                          <button
                            className="btn btn-danger btn-icon btn-small"
                            onClick={() => handleDelete(category)}
                            title="Xóa"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm danh mục mới"
        size="medium"
      >
        <form onSubmit={handleAddSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cat-name">Tên danh mục *</label>
              <input
                type="text"
                id="cat-name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cat-description">Mô tả</label>
              <textarea
                id="cat-description"
                name="description"
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsAddModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Đang tạo...' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Chỉnh sửa: ${selectedCategory?.name}`}
        size="medium"
      >
        <form onSubmit={handleEditSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-cat-name">Tên danh mục *</label>
              <input
                type="text"
                id="edit-cat-name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-cat-description">Mô tả</label>
              <textarea
                id="edit-cat-description"
                name="description"
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-info">
            <p><strong>ID:</strong> {selectedCategory?.id}</p>
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
        <p>Bạn có chắc chắn muốn xóa danh mục <strong>{selectedCategory?.name}</strong>?</p>
        <p style={{ color: 'var(--danger-color)', marginTop: '12px', fontSize: '14px' }}>
          ⚠️ Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng!
        </p>
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

export default CategoryManager;
