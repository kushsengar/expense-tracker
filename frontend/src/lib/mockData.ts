import type { Expense, PaginatedResponse } from '../api/expenses';

// Mock expenses for visual demo when backend is not running
const generateMockExpenses = (): Expense[] => {
  const titles = [
    'Groceries', 'Netflix Subscription', 'Coffee', 'Uber Ride', 'Restaurant Dinner',
    'Electricity Bill', 'Gym Membership', 'Amazon Shopping', 'Petrol', 'Phone Bill',
    'Movie Tickets', 'Spotify Premium', 'Haircut', 'Office Supplies', 'Laundry',
    'Books', 'Medicine', 'Insurance Premium', 'Internet Bill', 'Parking Fee',
    'Lunch', 'Taxi', 'Clothing', 'Home Repair', 'Water Bill',
    'Donation', 'Gift Purchase', 'Train Ticket', 'Flight Booking', 'Hotel Stay',
  ];
  const now = new Date();
  return titles.map((title, i) => {
    const daysAgo = Math.floor(i * 2.5);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return {
      id: i + 1,
      title,
      amount: Math.round((Math.random() * 5000 + 100) * 100) / 100,
      createdAt: date.toISOString(),
      lastModified: date.toISOString(),
    };
  });
};

const allExpenses = generateMockExpenses();

export const mockExpenseApi = {
  getAll: (
    filters: { title?: string; minAmount?: number; maxAmount?: number } = {},
    page = 0,
    size = 10,
  ): PaginatedResponse<Expense> => {
    let filtered = [...allExpenses];
    if (filters.title) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter((e) => e.amount >= filters.minAmount!);
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter((e) => e.amount <= filters.maxAmount!);
    }

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const items = filtered.slice(start, start + size);

    return { items, page, size, totalElements, totalPages, last: page >= totalPages - 1 };
  },

  getStats: () => {
    const total = allExpenses.reduce((s, e) => s + e.amount, 0);
    const now = new Date();
    const currentMonth = allExpenses.filter((e) => {
      const d = new Date(e.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthTotal = currentMonth.reduce((s, e) => s + e.amount, 0);

    // Monthly breakdown for chart (last 6 months)
    const monthlyBreakdown: { month: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mExpenses = allExpenses.filter((e) => {
        const ed = new Date(e.createdAt);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      });
      monthlyBreakdown.push({
        month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        total: mExpenses.reduce((s, e) => s + e.amount, 0),
      });
    }

    return {
      totalExpenses: total,
      totalCount: allExpenses.length,
      currentMonthTotal: monthTotal,
      currentMonthCount: currentMonth.length,
      dailyAverage: Math.round((total / 30) * 100) / 100,
      monthlyBreakdown,
    };
  },

  getRecent: (): Expense[] => allExpenses.slice(0, 5),
};
