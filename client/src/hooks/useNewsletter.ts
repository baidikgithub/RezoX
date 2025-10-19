import { useState, useCallback } from 'react';
import { 
  subscribeToNewsletter, 
  unsubscribeFromNewsletter,
  NewsletterSubscriptionRequest 
} from '../services/newsletterService';

export const useNewsletter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async (subscriptionData: NewsletterSubscriptionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const subscription = await subscribeToNewsletter(subscriptionData);
      return subscription;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe to newsletter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await unsubscribeFromNewsletter(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe from newsletter');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    subscribe,
    unsubscribe,
  };
};

