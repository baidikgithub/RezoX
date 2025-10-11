// components/FiltersBar.tsx
import { Row, Col, Select, Input } from 'antd';
import { SearchOutlined, SortAscendingOutlined } from '@ant-design/icons';

const { Search } = Input;

interface FiltersBarProps {
  propertyType: string;
  location: string;
  priceRange: string;
  bedrooms: string;
  sortBy: string;
  searchTerm: string;
  onTypeChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onBedroomsChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function FiltersBar({
    propertyType, location, priceRange, bedrooms, sortBy, searchTerm, 
    onTypeChange, onLocationChange, onPriceChange, onBedroomsChange, onSortChange, onSearch
}: FiltersBarProps) {
  return (
    <Row gutter={[16, 16]} align="middle">
      {/* ...each control as in your current code, values and callbacks pulled from props... */}
    </Row>
  );
}
