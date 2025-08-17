// src/services/debtService.ts

export interface Debt {
  id: number;
  user_id: number;
  name: string;
  type: 'Utang' | 'Meminjamkan';
  method: string;
  date: string;
  amount: number;
  is_checked: boolean;
  created_at: string;
}

export interface CreateDebt {
  name: string;
  type: 'Utang' | 'Meminjamkan';
  method: string;
  date: string;
  amount: number;
}

export interface DebtStats {
  utang: number;
  piutang: number;
  total: number;
}

// Ambil dari environment atau default ke localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/signin';
      throw new Error('Unauthorized - please login again');
    }
    
    // Try to get error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    } catch {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
  
  // Handle No Content responses
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

export const debtService = {
  // Get all debts
  async getDebts(): Promise<Debt[]> {
    try {
      const response = await fetch(`${API_BASE}/api/debts`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching debts:', error);
      throw error;
    }
  },

  // Create new debt
  async createDebt(debt: CreateDebt): Promise<Debt> {
    try {
      const response = await fetch(`${API_BASE}/api/debts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(debt)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating debt:', error);
      throw error;
    }
  },

  // Update debt
  async updateDebt(id: number, debt: Partial<CreateDebt & { is_checked: boolean }>): Promise<Debt> {
    try {
      const response = await fetch(`${API_BASE}/api/debts/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(debt)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating debt:', error);
      throw error;
    }
  },

  // Delete debt
  async deleteDebt(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/api/debts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      await handleResponse(response);
    } catch (error) {
      console.error('Error deleting debt:', error);
      throw error;
    }
  },

  // Toggle debt status (checked/unchecked)
  async toggleDebtStatus(id: number): Promise<Debt> {
    try {
      const response = await fetch(`${API_BASE}/api/debts/${id}/toggle`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error toggling debt status:', error);
      throw error;
    }
  },

  // Get debt statistics
  async getDebtStats(): Promise<DebtStats> {
    try {
      const response = await fetch(`${API_BASE}/api/debts/stats`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching debt stats:', error);
      throw error;
    }
  }
};