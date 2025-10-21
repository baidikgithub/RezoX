'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Tag, 
  Space, 
  Divider, 
  Image, 
  Carousel, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  message,
  Spin,
  Alert
} from 'antd';
import { 
  HomeOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  SettingOutlined, 
  ArrowsAltOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
  WifiOutlined,
  FireOutlined
} from '@ant-design/icons';
import MainWrapper from '../../../components/layouts/MainWrapper';
import SocialShareModal from '../../../components/SocialShareModal';
import PropertyCard from '../../../components/PropertyCard';
import { useProperty, useProperties } from '../../../hooks/useProperties';
import { useUserProfile } from '../../../hooks/useUser';
import { useBookings } from '../../../hooks/useBookings';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../contexts/ThemeContext';
import { Property, BookingRequest } from '../../../utils/types';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function PropertyDetails() {
  const params = useParams();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const propertyId = params.id as string;

  const { property, loading, error } = useProperty(propertyId);
  const { data: similarPropertiesData } = useProperties({
    propertyType: property?.propertyType,
    limit: 4
  });
  const { profile } = useUserProfile();
  const { createBooking } = useBookings();

  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingForm] = Form.useForm();
  const [bookingLoading, setBookingLoading] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleFavorite = async () => {
    if (user && property) {
      // await toggleFavorite(property._id); // Temporarily disabled
      console.log('Favorite functionality temporarily disabled');
    } else {
      message.warning('Please login to add favorites');
    }
  };

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const handleBookViewing = () => {
    if (!user) {
      message.warning('Please login to book a viewing');
      return;
    }
    setBookingModalVisible(true);
  };

  const handleBookingSubmit = async (values: any) => {
    if (!user || !property) return;

    setBookingLoading(true);
    try {
      const bookingData: BookingRequest = {
        propertyId: property._id,
        startDate: values.scheduledDate.toDate(),
        endDate: values.scheduledDate.add(1, 'hour').toDate(), // Add 1 hour for viewing duration
        contactInfo: {
          name: values.name,
          phone: values.phone,
          email: values.email,
        },
        specialRequests: values.message,
      };

      await createBooking(bookingData);
      message.success('Viewing booked successfully!');
      setBookingModalVisible(false);
      bookingForm.resetFields();
    } catch (err) {
      message.error('Failed to book viewing. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <MainWrapper>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <Paragraph style={{ marginTop: '16px' }}>Loading property details...</Paragraph>
        </div>
      </MainWrapper>
    );
  }

  if (error || !property) {
    return (
      <MainWrapper>
        <Alert
          message="Property Not Found"
          description={error || 'The property you are looking for does not exist.'}
          type="error"
          showIcon
          style={{ margin: '32px 0' }}
        />
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Property Images */}
        <Card style={{ marginBottom: '32px', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <Carousel
              autoplay
              style={{ height: '500px' }}
              arrows
              infinite
            >
              {property.images?.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image.url}
                    alt={image.alt || `${property.title} - Image ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '500px',
                      objectFit: 'cover'
                    }}
                    preview={{
                      mask: 'Click to preview'
                    }}
                  />
                </div>
              ))}
            </Carousel>
            
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              gap: '12px'
            }}>
              <Button
                type="text"
                shape="circle"
                icon={<HeartOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  color: '#8c8c8c' // isFavorite temporarily disabled
                }}
                onClick={handleFavorite}
              />
              <Button
                type="text"
                shape="circle"
                icon={<ShareAltOutlined />}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  color: '#1890ff'
                }}
                onClick={handleShare}
              />
            </div>

            <Tag
              color={property.propertyType === 'house' ? '#52c41a' : '#1890ff'}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                fontSize: '16px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Tag>
          </div>
        </Card>

        <Row gutter={[32, 32]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Property Info */}
            <Card style={{ marginBottom: '32px', borderRadius: '16px' }}>
              <div style={{ marginBottom: '24px' }}>
                <Title level={2} style={{ 
                  marginBottom: '8px',
                  color: isDarkMode ? '#ffffff' : '#262626'
                }}>
                  {property.title}
                </Title>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <EnvironmentOutlined style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c', marginRight: '8px' }} />
                  <Text style={{ 
                    fontSize: '16px',
                    color: isDarkMode ? '#a0a0a0' : '#8c8c8c'
                  }}>
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
                  </Text>
                </div>

                <Title level={1} style={{ 
                  margin: 0,
                  color: '#1890ff',
                  fontSize: '36px',
                  fontWeight: 'bold'
                }}>
                  {formatPrice(property.price)}
                  {property.propertyType === 'apartment' && <Text style={{ fontSize: '18px', fontWeight: 'normal' }}>/month</Text>}
                </Title>
              </div>

              <Divider />

              {/* Property Details */}
              <Row gutter={[32, 16]} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <UserOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#262626' }}>
                      {property.bedrooms}
                    </div>
                    <div style={{ fontSize: '14px', color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                      Bedrooms
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <SettingOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#262626' }}>
                      {property.bathrooms}
                    </div>
                    <div style={{ fontSize: '14px', color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                      Bathrooms
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <ArrowsAltOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#262626' }}>
                      {property.area}
                    </div>
                    <div style={{ fontSize: '14px', color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                      Sq Ft
                    </div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <CarOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#262626' }}>
                      {property.amenities?.includes('Parking') ? 'Yes' : 'No'}
                    </div>
                    <div style={{ fontSize: '14px', color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                      Parking
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <Title level={4} style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>
                  Description
                </Title>
                <Paragraph style={{ 
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: isDarkMode ? '#d9d9d9' : '#595959'
                }}>
                  {property.description || 'No description available.'}
                </Paragraph>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <Title level={4} style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>
                    Features
                  </Title>
                  <Space wrap>
                    {property.features.map((feature, index) => (
                      <Tag key={index} color="blue" style={{ marginBottom: '8px' }}>
                        {feature}
                      </Tag>
                    ))}
                  </Space>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <Title level={4} style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>
                    Amenities
                  </Title>
                  <Row gutter={[16, 16]}>
                    {property.amenities.map((amenity, index) => {
                      const getAmenityIcon = (amenity: string) => {
                        const lowerAmenity = amenity.toLowerCase();
                        if (lowerAmenity.includes('parking') || lowerAmenity.includes('garage')) return <CarOutlined />;
                        if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) return <WifiOutlined />;
                        if (lowerAmenity.includes('pool')) return <FireOutlined />;
                        if (lowerAmenity.includes('garden') || lowerAmenity.includes('balcony')) return <HomeOutlined />;
                        if (lowerAmenity.includes('gym') || lowerAmenity.includes('fitness')) return <SettingOutlined />;
                        return <HomeOutlined />;
                      };

                      return (
                        <Col span={8} key={index}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                            borderRadius: '8px',
                            border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`
                          }}>
                            <div style={{ 
                              marginRight: '8px', 
                              color: '#52c41a',
                              fontSize: '16px'
                            }}>
                              {getAmenityIcon(amenity)}
                            </div>
                            <Text style={{ 
                              color: isDarkMode ? '#ffffff' : '#262626',
                              fontSize: '14px'
                            }}>
                              {amenity}
                            </Text>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              )}
            </Card>

            {/* Similar Properties */}
            {similarPropertiesData?.properties && similarPropertiesData.properties.length > 0 && (
              <Card style={{ borderRadius: '16px' }}>
                <Title level={3} style={{ 
                  color: isDarkMode ? '#ffffff' : '#262626',
                  marginBottom: '24px'
                }}>
                  Similar Properties
                </Title>
                <Row gutter={[16, 16]}>
                  {similarPropertiesData.properties
                    .filter(p => p._id !== property?._id)
                    .slice(0, 3)
                    .map((similarProperty) => (
                      <Col span={24} key={similarProperty._id}>
                        <div
                          style={{
                            display: 'flex',
                            padding: '16px',
                            background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                            borderRadius: '12px',
                            border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = isDarkMode ? '#3a3a3a' : '#ffffff';
                            e.currentTarget.style.borderColor = '#1890ff';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDarkMode ? '#2a2a2a' : '#f8f9fa';
                            e.currentTarget.style.borderColor = isDarkMode ? '#434343' : '#e8e8e8';
                          }}
                          onClick={() => router.push(`/property/${similarProperty._id}`)}
                        >
                          <img
                            src={similarProperty.images?.[0]?.url || '/placeholder-property.jpg'}
                            alt={similarProperty.title}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginRight: '16px'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <Title level={5} style={{ 
                              margin: 0,
                              color: isDarkMode ? '#ffffff' : '#262626',
                              marginBottom: '4px'
                            }}>
                              {similarProperty.title}
                            </Title>
                            <Text type="secondary" style={{ 
                              fontSize: '12px',
                              display: 'block',
                              marginBottom: '8px'
                            }}>
                              {similarProperty.location?.city}, {similarProperty.location?.state}
                            </Text>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text strong style={{ 
                                color: '#1890ff',
                                fontSize: '16px'
                              }}>
                                {formatPrice(similarProperty.price)}
                                {similarProperty.propertyType === 'apartment' && <Text style={{ fontSize: '12px' }}>/month</Text>}
                              </Text>
                              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                                <span>{similarProperty.bedrooms} bed</span>
                                <span>{similarProperty.bathrooms} bath</span>
                                <span>{similarProperty.area} sqft</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                </Row>
              </Card>
            )}
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Contact Card */}
            <Card style={{ marginBottom: '24px', borderRadius: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '32px',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {property.owner?.name?.charAt(0) || property.agent?.name?.charAt(0) || 'A'}
                </div>
                <Title level={4} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#262626' }}>
                  {property.owner?.name || property.agent?.name || 'Property Owner'}
                </Title>
                <Text type="secondary" style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                  {property.owner?.email ? 'Property Owner' : 'Real Estate Agent'}
                </Text>
              </div>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CalendarOutlined />}
                  onClick={handleBookViewing}
                  style={{ width: '100%', height: '48px', borderRadius: '8px' }}
                >
                  Book a Viewing
                </Button>
                
                <Button
                  size="large"
                  icon={<PhoneOutlined />}
                  style={{ width: '100%', height: '48px', borderRadius: '8px' }}
                >
                  Call Agent
                </Button>
                
                <Button
                  size="large"
                  icon={<MailOutlined />}
                  style={{ width: '100%', height: '48px', borderRadius: '8px' }}
                >
                  Email Agent
                </Button>
              </Space>

              <Divider />

              <div>
                <Text strong style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>Contact Information</Text>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ 
                    marginBottom: '8px',
                    padding: '8px 12px',
                    background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`
                  }}>
                    <PhoneOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    <Text style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>
                      {property.owner?.phone || property.agent?.phone || '+1 (555) 123-4567'}
                    </Text>
                  </div>
                  <div style={{
                    padding: '8px 12px',
                    background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`
                  }}>
                    <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    <Text style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>
                      {property.owner?.email || property.agent?.email || 'contact@rezoX.com'}
                    </Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Property Status */}
            <Card style={{ borderRadius: '16px' }}>
              <Title level={4} style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>Property Status</Title>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`
                }}>
                  <Text strong style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>Status:</Text>
                  <Tag color={property.availability === 'available' ? 'green' : 'orange'} style={{ margin: 0 }}>
                    {property.availability || 'Available'}
                  </Tag>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`
                }}>
                  <Text strong style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>Property Type:</Text>
                  <Text style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                    {property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1) || 'N/A'}
                  </Text>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`
                }}>
                  <Text strong style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>Pet Friendly:</Text>
                  <Tag color={property.amenities?.includes('Pet Friendly') ? 'green' : 'red'} style={{ margin: 0 }}>
                    {property.amenities?.includes('Pet Friendly') ? 'Yes' : 'No'}
                  </Tag>
                </div>
              </div>

              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                  borderRadius: '8px',
                  border: `1px solid ${isDarkMode ? '#434343' : '#e8e8e8'}`
                }}>
                  <Text strong style={{ color: isDarkMode ? '#ffffff' : '#262626' }}>Listed:</Text>
                  <Text style={{ color: isDarkMode ? '#a0a0a0' : '#8c8c8c' }}>
                    {property.createdAt ? new Date(property.createdAt).toLocaleDateString() : 'N/A'}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Booking Modal */}
      <Modal
        title="Book a Viewing"
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={bookingForm}
          layout="vertical"
          onFinish={handleBookingSubmit}
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="scheduledDate"
            label="Preferred Date & Time"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Additional Message (Optional)"
          >
            <TextArea
              rows={4}
              placeholder="Any specific requirements or questions..."
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={bookingLoading}
              style={{ width: '100%' }}
            >
              Book Viewing
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Social Share Modal */}
      {property && (
        <SocialShareModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          property={property}
          url={window.location.href}
        />
      )}
    </MainWrapper>
  );
}
