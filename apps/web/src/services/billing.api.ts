import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const billingApi = {
  subscribeToPlan: async (tenantId: string, planName: string) => {
    try {
      const response = await axios.post(`${API_URL}/subscriptions/subscribe`, {
        tenantId,
        planName,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to initiate subscription', error);
      throw error;
    }
  },

  getActiveSubscription: async (tenantId: string) => {
    try {
      const response = await axios.get(`${API_URL}/subscriptions/active`, {
        params: { tenantId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch active subscription', error);
      throw error;
    }
  }
};
