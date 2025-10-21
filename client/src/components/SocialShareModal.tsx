'use client';

import React, { useState } from 'react';
import { Modal, Button, Row, Col, message, Input, Typography } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  LinkedinOutlined, 
  WhatsAppOutlined, 
  MailOutlined, 
  LinkOutlined,
  CopyOutlined,
  ShareAltOutlined
} from '@ant-design/icons';
import { Property } from '../utils/types';
import { useTheme } from '../contexts/ThemeContext';

const { TextArea } = Input;
const { Text } = Typography;

interface SocialShareModalProps {
  visible: boolean;
  onClose: () => void;
  property: Property;
  url?: string;
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({
  visible,
  onClose,
  property,
  url
}) => {
  const { isDarkMode } = useTheme();
  const [customMessage, setCustomMessage] = useState('');
  
  const currentUrl = url || window.location.href;
  const shareText = customMessage || `Check out this amazing ${property.propertyType} in ${property.location?.city}! ${property.title} - ${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price)}`;
  
  const shareUrl = currentUrl;

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(property.title)}&summary=${encodeURIComponent(shareText)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaEmail = () => {
    const subject = `Check out this property: ${property.title}`;
    const body = `${shareText}\n\nView property: ${shareUrl}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success('Link copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('Link copied to clipboard!');
    }
  };

  const shareViaNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: <FacebookOutlined style={{ fontSize: '24px', color: '#1877f2' }} />,
      onClick: shareToFacebook,
      color: '#1877f2'
    },
    {
      name: 'Twitter',
      icon: <TwitterOutlined style={{ fontSize: '24px', color: '#1da1f2' }} />,
      onClick: shareToTwitter,
      color: '#1da1f2'
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinOutlined style={{ fontSize: '24px', color: '#0077b5' }} />,
      onClick: shareToLinkedIn,
      color: '#0077b5'
    },
    {
      name: 'WhatsApp',
      icon: <WhatsAppOutlined style={{ fontSize: '24px', color: '#25d366' }} />,
      onClick: shareToWhatsApp,
      color: '#25d366'
    },
    {
      name: 'Email',
      icon: <MailOutlined style={{ fontSize: '24px', color: '#ea4335' }} />,
      onClick: shareViaEmail,
      color: '#ea4335'
    },
    {
      name: 'Copy Link',
      icon: <CopyOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />,
      onClick: copyToClipboard,
      color: '#8c8c8c'
    }
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShareAltOutlined style={{ color: '#1890ff' }} />
          <span>Share Property</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      style={{
        top: 20,
      }}
      styles={{
        body: {
          background: isDarkMode ? '#1f1f1f' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#262626'
        },
        header: {
          background: isDarkMode ? '#1f1f1f' : '#ffffff',
          borderBottom: `1px solid ${isDarkMode ? '#434343' : '#f0f0f0'}`
        }
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '16px',
          padding: '12px',
          background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
          borderRadius: '8px'
        }}>
          <img
            src={property.images?.[0]?.url || '/placeholder-property.jpg'}
            alt={property.title}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '6px'
            }}
          />
          <div style={{ flex: 1 }}>
            <Text strong style={{ 
              color: isDarkMode ? '#ffffff' : '#262626',
              fontSize: '16px',
              display: 'block',
              marginBottom: '4px'
            }}>
              {property.title}
            </Text>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {property.location?.city}, {property.location?.state}
            </Text>
            <Text strong style={{ 
              color: '#1890ff',
              fontSize: '16px',
              display: 'block',
              marginTop: '4px'
            }}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(property.price)}
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ 
            color: isDarkMode ? '#ffffff' : '#262626',
            marginBottom: '8px',
            display: 'block'
          }}>
            Customize your message:
          </Text>
          <TextArea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Add a personal message to your share..."
            rows={3}
            style={{
              background: isDarkMode ? '#2a2a2a' : '#ffffff',
              borderColor: isDarkMode ? '#434343' : '#d9d9d9',
              color: isDarkMode ? '#ffffff' : '#262626'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ 
            color: isDarkMode ? '#ffffff' : '#262626',
            marginBottom: '12px',
            display: 'block'
          }}>
            Share on social media:
          </Text>
          <Row gutter={[16, 16]}>
            {socialPlatforms.map((platform) => (
              <Col span={8} key={platform.name}>
                <Button
                  type="text"
                  onClick={platform.onClick}
                  style={{
                    width: '100%',
                    height: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    border: `1px solid ${isDarkMode ? '#434343' : '#d9d9d9'}`,
                    borderRadius: '8px',
                    background: isDarkMode ? '#2a2a2a' : '#ffffff',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = platform.color;
                    e.currentTarget.style.borderColor = platform.color;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#2a2a2a' : '#ffffff';
                    e.currentTarget.style.borderColor = isDarkMode ? '#434343' : '#d9d9d9';
                    e.currentTarget.style.color = 'inherit';
                  }}
                >
                  {platform.icon}
                  <Text style={{ 
                    fontSize: '12px',
                    color: 'inherit',
                    margin: 0
                  }}>
                    {platform.name}
                  </Text>
                </Button>
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px',
          padding: '12px',
          background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
          borderRadius: '8px',
          alignItems: 'center'
        }}>
          <LinkOutlined style={{ color: '#8c8c8c' }} />
          <Text 
            style={{ 
              flex: 1,
              color: isDarkMode ? '#d9d9d9' : '#8c8c8c',
              fontSize: '12px',
              wordBreak: 'break-all'
            }}
          >
            {shareUrl}
          </Text>
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={copyToClipboard}
            style={{ color: '#1890ff' }}
          >
            Copy
          </Button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        gap: '12px',
        marginTop: '24px',
        paddingTop: '16px',
        borderTop: `1px solid ${isDarkMode ? '#434343' : '#f0f0f0'}`
      }}>
        <Button onClick={onClose} style={{ flex: 1 }}>
          Close
        </Button>
        <Button 
          type="primary" 
          onClick={shareViaNativeShare}
          style={{ flex: 1 }}
          icon={<ShareAltOutlined />}
        >
          Share
        </Button>
      </div>
    </Modal>
  );
};

export default SocialShareModal;
