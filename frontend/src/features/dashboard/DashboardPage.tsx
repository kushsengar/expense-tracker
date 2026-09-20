import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Plus, TrendingUp, Calendar, DollarSign, ArrowRight, Receipt } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { expenseApi } from '../../api/expenses';
import { formatCurrency, formatDateShort } from '../../lib/formatters';
import type { Expense } from '../../api/expenses';
import './Dashboard.css';

interface Stats {
  totalExpenses: number;
  totalCount: number;
  currentMonthTotal: number;
  currentMonthCount: number;
  dailyAverage: number;
  monthlyBreakdown: { month: string; total: number }[];
}

const computeStats = (expenses: Expense[]): Stats => {
  const now = new Date();
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const currentMonth = expenses.filter((e) => {
    const d = new Date(e.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const currentMonthTotal = currentMonth.reduce((s, e) => s + e.amount, 0);

  // Monthly breakdown for chart (last 6 months)
  const monthlyBreakdown: { month: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthExpenses = expenses.filter((e) => {
      const ed = new Date(e.createdAt);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    });
    monthlyBreakdown.push({
      month: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      total: monthExpenses.reduce((s, e) => s + e.amount, 0),
    });
  }

  return {
    totalExpenses,
    totalCount: expenses.length,
    currentMonthTotal,
    currentMonthCount: currentMonth.length,
    dailyAverage: expenses.length > 0 ? Math.round((totalExpenses / 30) * 100) / 100 : 0,
    monthlyBreakdown,
  };
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch a large page to compute stats client-side
        const result = await expenseApi.getAll({}, 0, 50, 'createdAt,desc');
        setAllExpenses(result.items);
      } catch (err) {
        console.error('Failed to fetch expenses for dashboard:', err);
        setAllExpenses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const stats = useMemo(() => computeStats(allExpenses), [allExpenses]);
  const recent = allExpenses.slice(0, 5);

  const theme = document.documentElement.getAttribute('data-theme');
  const accentColor = theme === 'dark' ? '#818cf8' : '#6366f1';
  const gridColor = theme === 'dark' ? '#2d3141' : '#e5e7eb';

  const summaryCards = useMemo(() => [
    {
      label: 'Total Expenses',
      value: formatCurrency(stats.totalExpenses),
      sub: `${stats.totalCount} items`,
      icon: <DollarSign size={20} />,
      color: 'var(--accent)',
    },
    {
      label: 'This Month',
      value: formatCurrency(stats.currentMonthTotal),
      sub: `${stats.currentMonthCount} items`,
      icon: <Calendar size={20} />,
      color: 'var(--success)',
    },
    {
      label: 'Daily Average',
      value: formatCurrency(stats.dailyAverage),
      sub: 'last 30 days',
      icon: <TrendingUp size={20} />,
      color: 'var(--warning)',
    },
  ], [stats]);

  if (loading) {
    return (
      <div className="dashboard">
        <PageHeader title="Dashboard" subtitle="Overview of your spending" />
        <div className="dashboard-cards">
          {[1, 2, 3].map((i) => (
            <div key={i} className="summary-card">
              <Skeleton width="44px" height="44px" borderRadius="var(--radius-md)" />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton width="80px" height="12px" />
                <Skeleton width="120px" height="24px" />
                <Skeleton width="60px" height="10px" />
              </div>
            </div>
          ))}
        </div>
        <div className="dashboard-chart">
          <Skeleton width="160px" height="20px" />
          <div style={{ marginTop: '20px' }}>
            <Skeleton width="100%" height="250px" borderRadius="var(--radius-md)" />
          </div>
        </div>
      </div>
    );
  }

  if (allExpenses.length === 0) {
    return (
      <div className="dashboard">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your spending"
          action={
            <Button icon={<Plus size={16} />} onClick={() => navigate('/expenses')}>
              Add Expense
            </Button>
          }
        />
        <EmptyState
          icon={<Receipt />}
          title="No expenses yet"
          description="Add your first expense to see spending insights here"
          actionLabel="Add Expense"
          onAction={() => navigate('/expenses')}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your spending"
        action={
          <Button icon={<Plus size={16} />} onClick={() => navigate('/expenses')}>
            Add Expense
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="dashboard-cards">
        {summaryCards.map((card) => (
          <div key={card.label} className="summary-card">
            <div className="summary-card-icon" style={{ color: card.color, background: `${card.color}15` }}>
              {card.icon}
            </div>
            <div className="summary-card-content">
              <span className="summary-card-label">{card.label}</span>
              <span className="summary-card-value mono">{card.value}</span>
              <span className="summary-card-sub">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="dashboard-chart">
        <h2>Spending Over Time</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.monthlyBreakdown} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-md)',
                  fontSize: '13px',
                }}
                formatter={(value: number) => [formatCurrency(value), 'Total']}
                cursor={{ fill: 'var(--accent-subtle)', radius: 4 }}
              />
              <Bar dataKey="total" fill={accentColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="dashboard-recent">
        <div className="dashboard-recent-header">
          <h2>Recent Expenses</h2>
          <button className="link-button" onClick={() => navigate('/expenses')}>
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="recent-list">
          {recent.map((expense) => (
            <div key={expense.id} className="recent-item">
              <div className="recent-item-info">
                <span className="recent-item-title">{expense.title}</span>
                <span className="recent-item-date">{formatDateShort(expense.createdAt)}</span>
              </div>
              <span className="recent-item-amount mono">{formatCurrency(expense.amount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
