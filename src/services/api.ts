// Base URL configuration
const BASE_URL = 'http://localhost:3000'; // Adjust this to your backend URL

// Type definitions
export interface Transaction {
  id: number;
  name: string;
  date: string;
  amount: number;
  type: 'Utang' | 'Piutang';
}

export interface DebtStats {
  utang: number;
  piutang: number;
  total: number;
}

export interface WeeklyActivityData {
  week: string;
  utang: number;
  piutang: number;
}

export interface YearlyActivityData {
  year: string;
  utang: number;
  piutang: number;
}

export interface BalanceHistoryData {
  month: string;
  balance: number;
}

// Auth token management
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    const text = await response.text();
    throw new Error(`Expected JSON response but got: ${text}`);
  }
};

// API Service class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Authentication methods
  async signIn(email: string, password: string): Promise<{ token: string, user: any }> {
    try {
      const response = await fetch(`${this.baseURL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name: '' })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, name: string): Promise<{ token: string, user: any }> {
    try {
      const response = await fetch(`${this.baseURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name })
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('SignUp error:', error);
      throw error;
    }
  }

  // Data fetching methods
  async getYearlyActivity(years: number = 3): Promise<YearlyActivityData[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts/yearly-activity?months=${years}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await handleResponse(response);
      
      // Ensure data is an array and has the correct structure
      if (!Array.isArray(data)) {
        console.warn('Yearly activity data is not an array:', data);
        return [];
      }

      // Transform and validate data
      return data.map(item => ({
        year: String(item.year || new Date().getFullYear()),
        utang: Number(item.utang || 0),
        piutang: Number(item.piutang || 0)
      }));
    } catch (error) {
      console.error('Failed to fetch yearly activity:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  async getRecentTransactions(): Promise<Transaction[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts/recent`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await handleResponse(response);
      
      if (!Array.isArray(data)) {
        console.warn('Recent transactions data is not an array:', data);
        return [];
      }

      return data.map(item => ({
        id: Number(item.id || 0),
        name: String(item.name || 'Unknown'),
        date: String(item.date || new Date().toISOString()),
        amount: Number(item.amount || 0),
        type: item.type === 'Piutang' ? 'Piutang' : 'Utang'
      }));
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error);
      return [];
    }
  }

  async getDebtStats(): Promise<DebtStats> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await handleResponse(response);
      
      return {
        utang: Number(data.utang || 0),
        piutang: Number(data.piutang || 0),
        total: Number(data.total || 0)
      };
    } catch (error) {
      console.error('Failed to fetch debt stats:', error);
      return {
        utang: 0,
        piutang: 0,
        total: 0
      };
    }
  }

  async getBalanceHistory(months: number = 7): Promise<BalanceHistoryData[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts/balance-history?months=${months}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await handleResponse(response);
      
      if (!Array.isArray(data)) {
        console.warn('Balance history data is not an array:', data);
        return [];
      }

      return data.map(item => ({
        month: String(item.month || 'Unknown'),
        balance: Number(item.balance || 0)
      }));
    } catch (error) {
      console.error('Failed to fetch balance history:', error);
      return [];
    }
  }

  // Weekly activity (if needed)
  async getWeeklyActivity(): Promise<WeeklyActivityData[]> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts/weekly-activity`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await handleResponse(response);
      
      if (!Array.isArray(data)) {
        console.warn('Weekly activity data is not an array:', data);
        return [];
      }

      return data.map(item => ({
        week: String(item.week || 'Unknown'),
        utang: Number(item.utang || 0),
        piutang: Number(item.piutang || 0)
      }));
    } catch (error) {
      console.error('Failed to fetch weekly activity:', error);
      return [];
    }
  }

  // Add more API methods as needed for other operations
  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction)
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id: number): Promise<void> {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseURL}/api/debts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService(BASE_URL);
export default apiService;