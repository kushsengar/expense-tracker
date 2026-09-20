import api from './client';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  createdAt: string;
  lastModified: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ExpenseFilters {
  title?: string;
  minAmount?: number;
  maxAmount?: number;
  fromDate?: string;
  toDate?: string;
}

export const expenseApi = {
  getAll: async (
    filters: ExpenseFilters = {},
    page = 0,
    size = 10,
    sort = 'createdAt,desc'
  ): Promise<PaginatedResponse<Expense>> => {
    const params: Record<string, string | number> = { page, size, sort };
    if (filters.title) params.title = filters.title;
    if (filters.minAmount !== undefined) params.minAmount = filters.minAmount;
    if (filters.maxAmount !== undefined) params.maxAmount = filters.maxAmount;
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;

    const { data } = await api.get('/expenses', { params });
    return data;
  },

  getById: async (id: number): Promise<Expense> => {
    const { data } = await api.get(`/expenses/${id}`);
    return data;
  },

  create: async (payload: { title: string; amount: number }): Promise<Expense> => {
    const { data } = await api.post('/expenses', payload);
    return data;
  },

  update: async (id: number, payload: { title: string; amount: number }): Promise<Expense> => {
    const { data } = await api.put(`/expenses/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },
};
