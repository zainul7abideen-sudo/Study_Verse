const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  // Auth
  login: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  register: async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Books
  searchBooks: async (q: string, category: string = 'all') => {
    const res = await fetch(`${API_BASE_URL}/books/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`);
    return res.json();
  },

  // Resell
  getUsedBooks: async (condition?: string, university?: string) => {
    let url = `${API_BASE_URL}/resell`;
    const params = new URLSearchParams();
    if (condition && condition !== 'all') params.append('condition', condition);
    if (university && university !== 'all') params.append('university', university);
    if (params.toString()) url += `?${params.toString()}`;
    const res = await fetch(url);
    return res.json();
  },

  createUsedListing: async (bookData: any, userId?: string) => {
    const res = await fetch(`${API_BASE_URL}/resell`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify(bookData)
    });
    return res.json();
  },

  // Exchanges
  getExchanges: async (userId?: string) => {
    const res = await fetch(`${API_BASE_URL}/exchanges`, {
      headers: userId ? { 'x-user-id': userId } : {}
    });
    return res.json();
  },

  proposeExchange: async (proposalData: any, userId?: string) => {
    const res = await fetch(`${API_BASE_URL}/exchanges/propose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify(proposalData)
    });
    return res.json();
  },

  updateExchangeStatus: async (id: string, status: string, counterMessage?: string) => {
    const res = await fetch(`${API_BASE_URL}/exchanges/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, counterMessage })
    });
    return res.json();
  },

  // Orders
  getOrders: async (userId?: string) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: userId ? { 'x-user-id': userId } : {}
    });
    return res.json();
  },

  checkout: async (orderData: any, userId?: string) => {
    const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  retryAutoOrder: async (orderId: string) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/retry`, {
      method: 'POST'
    });
    return res.json();
  },

  // Academic
  getUniversities: async () => {
    const res = await fetch(`${API_BASE_URL}/academic/universities`);
    return res.json();
  },

  calculateSGPA: async (universityCode: string, subjects: any[]) => {
    const res = await fetch(`${API_BASE_URL}/academic/calculate-sgpa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ universityCode, subjects })
    });
    return res.json();
  },

  predictMarks: async (internalMarks: number, maxInternal: number, targetGradePoint: number) => {
    const res = await fetch(`${API_BASE_URL}/academic/predict-marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internalMarks, maxInternal, targetGradePoint })
    });
    return res.json();
  },

  // Admin
  getMaintenanceState: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/maintenance`);
    return res.json();
  },

  toggleMaintenance: async (isMaintenanceMode: boolean, message?: string, estimatedUptime?: string, userId?: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/maintenance/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(userId ? { 'x-user-id': userId } : {})
      },
      body: JSON.stringify({ isMaintenanceMode, message, estimatedUptime })
    });
    return res.json();
  },

  getAuditLogs: async (actionType?: string, userId?: string) => {
    const url = actionType && actionType !== 'all' 
      ? `${API_BASE_URL}/admin/logs?actionType=${encodeURIComponent(actionType)}`
      : `${API_BASE_URL}/admin/logs`;
    const res = await fetch(url, {
      headers: userId ? { 'x-user-id': userId } : {}
    });
    return res.json();
  },

  getStats: async (userId?: string) => {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: userId ? { 'x-user-id': userId } : {}
    });
    return res.json();
  }
};
