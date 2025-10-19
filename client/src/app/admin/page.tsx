'use client';

import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Switch, 
  Upload, 
  message,
  Statistic,
  Tabs
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  MailOutlined
} from '@ant-design/icons';
import MainWrapper from '../../components/layouts/MainWrapper';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useProperties } from '../../hooks/useProperties';
import { useBookings } from '../../hooks/useBookings';
import { useNewsletter } from '../../hooks/useNewsletter';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { Property, PropertyFilters } from '../../utils/types';

const { Title, Paragraph } = Typography;
const { Content, Sider } = Layout;
const { TextArea } = Input;
const { TabPane } = Tabs;

export default function AdminDashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [propertyModalVisible, setPropertyModalVisible] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propertyForm] = Form.useForm();

  // Mock data for demonstration
  const { data: propertiesData, loading: propertiesLoading } = useProperties({});
  const { data: bookingsData, loading: bookingsLoading } = useBookings();
  const { loading: newsletterLoading } = useNewsletter();

  const handleAddProperty = () => {
    setEditingProperty(null);
    propertyForm.resetFields();
    setPropertyModalVisible(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    propertyForm.setFieldsValue(property);
    setPropertyModalVisible(true);
  };

  const handleDeleteProperty = (propertyId: string) => {
    Modal.confirm({
      title: 'Delete Property',
      content: 'Are you sure you want to delete this property?',
      onOk: () => {
        // TODO: Implement delete property
        message.success('Property deleted successfully');
      },
    });
  };

  const handlePropertySubmit = async (values: any) => {
    try {
      // TODO: Implement create/update property
      message.success(editingProperty ? 'Property updated successfully' : 'Property created successfully');
      setPropertyModalVisible(false);
      propertyForm.resetFields();
    } catch (error) {
      message.error('Failed to save property');
    }
  };

  const propertyColumns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image: string) => (
        <img 
          src={image} 
          alt="Property" 
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'sale' ? 'green' : 'blue'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'available' ? 'green' : 'orange'}>
          {status || 'Available'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Property) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => window.open(`/property/${record._id}`, '_blank')}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditProperty(record)}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteProperty(record._id)}
          />
        </Space>
      ),
    },
  ];

  const bookingColumns = [
    {
      title: 'Property',
      dataIndex: 'propertyTitle',
      key: 'propertyTitle',
    },
    {
      title: 'Client',
      dataIndex: 'contactInfo',
      key: 'client',
      render: (contactInfo: any) => contactInfo?.name || 'N/A',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'viewing' ? 'blue' : type === 'rental' ? 'green' : 'orange'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'confirmed' ? 'green' : 
          status === 'pending' ? 'orange' : 
          status === 'cancelled' ? 'red' : 'blue'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small">View</Button>
          <Button size="small" type="primary">Confirm</Button>
        </Space>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <MainWrapper>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '32px' }}>
            <Title level={2} style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>
              Admin Dashboard
            </Title>
            <Paragraph style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
              Manage your properties, bookings, and platform settings
            </Paragraph>
          </div>

          {/* Stats Cards */}
          <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Properties"
                  value={propertiesData.pagination?.totalProperties || 0}
                  prefix={<HomeOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Bookings"
                  value={bookingsData?.bookings?.filter(b => b.status === 'pending').length || 0}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Newsletter Subscribers"
                  value={150} // Mock data
                  prefix={<MailOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={1250} // Mock data
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Main Content */}
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Properties" key="properties">
                <div style={{ marginBottom: '16px' }}>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddProperty}
                  >
                    Add New Property
                  </Button>
                </div>
                
                <Table
                  columns={propertyColumns}
                  dataSource={propertiesData.properties}
                  loading={propertiesLoading}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </TabPane>

              <TabPane tab="Bookings" key="bookings">
                <Table
                  columns={bookingColumns}
                  dataSource={bookingsData?.bookings || []}
                  loading={bookingsLoading}
                  rowKey="_id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                  }}
                />
              </TabPane>

              <TabPane tab="Analytics" key="analytics">
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <Title level={3}>Analytics Dashboard</Title>
                  <Paragraph>Property views, conversion rates, and user engagement metrics will be displayed here.</Paragraph>
                </div>
              </TabPane>

              <TabPane tab="Settings" key="settings">
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                  <Title level={3}>Platform Settings</Title>
                  <Paragraph>Configure platform settings, email templates, and system preferences.</Paragraph>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>

        {/* Property Modal */}
        <Modal
          title={editingProperty ? 'Edit Property' : 'Add New Property'}
          open={propertyModalVisible}
          onCancel={() => setPropertyModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={propertyForm}
            layout="vertical"
            onFinish={handlePropertySubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="Property Title"
                  rules={[{ required: true, message: 'Please enter property title' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: 'Please select type' }]}
                >
                  <Select>
                    <Select.Option value="sale">For Sale</Select.Option>
                    <Select.Option value="rent">For Rent</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="bedrooms"
                  label="Bedrooms"
                  rules={[{ required: true, message: 'Please enter bedrooms' }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="bathrooms"
                  label="Bathrooms"
                  rules={[{ required: true, message: 'Please enter bathrooms' }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[{ required: true, message: 'Please enter location' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="area"
                  label="Area (sq ft)"
                  rules={[{ required: true, message: 'Please enter area' }]}
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="image"
              label="Image URL"
            >
              <Input />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="featured"
                  label="Featured Property"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                >
                  <Select>
                    <Select.Option value="available">Available</Select.Option>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="sold">Sold</Select.Option>
                    <Select.Option value="rented">Rented</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </Button>
                <Button onClick={() => setPropertyModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </MainWrapper>
    </ProtectedRoute>
  );
}
