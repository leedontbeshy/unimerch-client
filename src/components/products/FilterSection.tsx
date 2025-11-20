import React from 'react';
import type { Category } from '../../types/product.types.ts';
import '../../css/product.css';

interface FilterSectionProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}) => {
  const handleCategoryClick = (categoryId: number | null) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className="filter-section">
      {/* Category Filters */}
      <div className="filter-section__categories">
        <button
          type="button"
          className={`filter-tag ${selectedCategory === null ? 'filter-tag--active' : ''}`}
          onClick={() => handleCategoryClick(null)}
        >
          TẤT CẢ
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`filter-tag ${selectedCategory === category.id ? 'filter-tag--active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="filter-section__sort">
        <span className="filter-section__sort-label">Sắp xếp:</span>
        <select
          className="filter-section__sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
          <option value="name_asc">Tên: A-Z</option>
          <option value="name_desc">Tên: Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSection;
