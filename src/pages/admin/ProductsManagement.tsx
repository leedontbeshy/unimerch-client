import React, { useEffect, useState, useCallback } from 'react';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import SearchBar from '../../components/admin/SearchBar';
import Modal from '../../components/admin/Modal';
import CategoryManager from '../../components/admin/CategoryManager';
import { EditIcon, TrashIcon, RefreshIcon, PlusIcon, SettingsIcon } from '../../components/admin/Icons';
import type { Product, ProductFilters, Category } from '../../types/admin.types';

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    quantity: '',
    image_url: '',
    category_id: '',
    status: 'available' as 'available' | 'out_of_stock' | 'discontinued',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await adminService.getProducts(filters);
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tải danh sách sản phẩm';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await adminService.getCategories();
      // Handle response safely
      if (response && response.categories) {
        setCategories(response.categories);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  const handleSearch = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, search: query, page: 1 }));
  }, []);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discount_price: '',
      quantity: '',
      image_url: '',
      category_id: '',
      status: 'available',
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      quantity: product.quantity.toString(),
      image_url: product.image_url || '',
      category_id: product.category_id?.toString() || '',
      status: product.status,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      await adminService.createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        quantity: parseInt(formData.quantity),
        image_url: formData.image_url,
        category_id: parseInt(formData.category_id),
        status: formData.status,
      });
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể tạo sản phẩm';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setIsSubmitting(true);
      setError('');
      await adminService.updateProduct(selectedProduct.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : undefined,
        quantity: parseInt(formData.quantity),
        image_url: formData.image_url,
        category_id: parseInt(formData.category_id),
        status: formData.status,
      });
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể cập nhật sản phẩm';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      await adminService.deleteProduct(selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể xóa sản phẩm';
      setError(message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      available: 'badge-success',
      out_of_stock: 'badge-warning',
      discontinued: 'badge-error',
    };
    return badges[status] || 'badge-secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Còn hàng',
      out_of_stock: 'Hết hàng',
      discontinued: 'Ngừng bán',
    };
    return labels[status] || status;
  };

  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '60px',
    },
    {
      key: 'image_url',
      title: 'Ảnh',
      width: '80px',
      render: (url: string, product: Product) => (
        <img
          src={url}
          alt={product.name}
          style={{
            width: '50px',
            height: '50px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      ),
    },
    {
      key: 'name',
      title: 'Tên sản phẩm',
    },
    {
      key: 'price',
      title: 'Giá',
      render: (price: number, product: Product) => (
        <div>
          <div>{formatCurrency(price)}</div>
          {product.discount_price && (
            <div style={{ fontSize: '12px', color: 'var(--neon-cyan)' }}>
              {formatCurrency(product.discount_price)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'quantity',
      title: 'Số lượng',
      width: '100px',
    },
    {
      key: 'category_name',
      title: 'Danh mục',
    },
    {
      key: 'seller_name',
      title: 'Người bán',
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
      key: 'actions',
      title: 'Thao tác',
      width: '120px',
      render: (_: unknown, product: Product) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-icon btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(product);
            }}
            title="Sửa"
          >
            <EditIcon />
          </button>
          <button
            className="btn btn-danger btn-icon btn-small"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(product);
            }}
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
        <h1 className="page-title">Quản lý sản phẩm</h1>
        <div className="page-actions">
          <button className="btn btn-secondary btn-small" onClick={fetchProducts}>
            <RefreshIcon /> Làm mới
          </button>
          <button className="btn btn-secondary btn-small" onClick={() => setIsCategoryManagerOpen(true)}>
            <SettingsIcon /> Quản lý danh mục
          </button>
          <button className="btn btn-primary btn-small" onClick={handleAdd}>
            <PlusIcon /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="content-card">
        <div className="card-header">
          <SearchBar onSearch={handleSearch} placeholder="Tìm theo tên sản phẩm..." />
        </div>

        <div className="filters-wrapper" style={{ padding: '0 28px' }}>
          <div className="filter-group">
            <label className="filter-label">Trạng thái</label>
            <select
              className="filter-select"
              value={filters.status}
              onChange={handleStatusFilter}
            >
              <option value="">Tất cả</option>
              <option value="available">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
              <option value="discontinued">Ngừng bán</option>
            </select>
          </div>
        </div>

        <div className="card-body">
          <DataTable
            columns={columns}
            data={products}
            isLoading={isLoading}
            emptyMessage="Không tìm thấy sản phẩm nào"
          />

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm sản phẩm mới"
        size="large"
      >
        <form onSubmit={handleAddSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Tên sản phẩm *</label>
              <input
                type="text"
                id="name"
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
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="price">Giá (VND) *</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleFormChange}
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="discount_price">Giá khuyến mãi (VND)</label>
              <input
                type="number"
                id="discount_price"
                name="discount_price"
                className="form-control"
                value={formData.discount_price}
                onChange={handleFormChange}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="quantity">Số lượng *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-control"
                value={formData.quantity}
                onChange={handleFormChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="category_id">Danh mục *</label>
              <select
                id="category_id"
                name="category_id"
                className="form-control"
                value={formData.category_id}
                onChange={handleFormChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Trạng thái *</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleFormChange}
                required
              >
                <option value="available">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="discontinued">Ngừng bán</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image_url">URL Hình ảnh</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                className="form-control"
                value={formData.image_url}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div style={{ marginTop: '12px' }}>
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxWidth: '300px',
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '8px',
                      background: 'rgba(0, 0, 0, 0.3)',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
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
              {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Chỉnh sửa: ${selectedProduct?.name}`}
        size="large"
      >
        <form onSubmit={handleEditSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-name">Tên sản phẩm *</label>
              <input
                type="text"
                id="edit-name"
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
              <label htmlFor="edit-description">Mô tả</label>
              <textarea
                id="edit-description"
                name="description"
                className="form-control"
                rows={4}
                value={formData.description}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="edit-price">Giá (VND) *</label>
              <input
                type="number"
                id="edit-price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleFormChange}
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-discount_price">Giá khuyến mãi (VND)</label>
              <input
                type="number"
                id="edit-discount_price"
                name="discount_price"
                className="form-control"
                value={formData.discount_price}
                onChange={handleFormChange}
                min="0"
                step="1000"
              />
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="edit-quantity">Số lượng *</label>
              <input
                type="number"
                id="edit-quantity"
                name="quantity"
                className="form-control"
                value={formData.quantity}
                onChange={handleFormChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-category_id">Danh mục *</label>
              <select
                id="edit-category_id"
                name="category_id"
                className="form-control"
                value={formData.category_id}
                onChange={handleFormChange}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row two-columns">
            <div className="form-group">
              <label htmlFor="edit-status">Trạng thái *</label>
              <select
                id="edit-status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleFormChange}
                required
              >
                <option value="available">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
                <option value="discontinued">Ngừng bán</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-image_url">URL Hình ảnh</label>
              <input
                type="url"
                id="edit-image_url"
                name="image_url"
                className="form-control"
                value={formData.image_url}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {formData.image_url && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <img
                src={formData.image_url}
                alt="Preview"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: 'auto',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="form-info">
            <p><strong>ID:</strong> {selectedProduct?.id}</p>
            <p><strong>Người bán:</strong> {selectedProduct?.seller_name}</p>
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
        <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{selectedProduct?.name}</strong>?</p>
        <p style={{ color: 'var(--danger-color)', marginTop: '12px', fontSize: '14px' }}>
          ⚠️ Hành động này không thể hoàn tác!
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

      {/* Category Manager */}
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        onCategoryChange={fetchCategories}
      />
    </>
  );
};

export default ProductsManagement;
