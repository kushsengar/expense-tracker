import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, ArrowUpDown, Receipt, Loader2 } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonRow } from '../../components/ui/Skeleton';
import { ExpenseModal } from './ExpenseModal';
import { expenseApi } from '../../api/expenses';
import { formatCurrency, formatDate } from '../../lib/formatters';
import type { Expense, PaginatedResponse } from '../../api/expenses';
import './ExpenseList.css';

export const ExpenseListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PaginatedResponse<Expense>>({
    items: [], page: 0, size: 10, totalElements: 0, totalPages: 0, last: true,
  });
  const pageSize = 10;

  // Fetch expenses from the real API
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await expenseApi.getAll(
        { title: search || undefined },
        page,
        pageSize,
        'createdAt,desc'
      );
      setData(result);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
      setData({ items: [], page: 0, size: pageSize, totalElements: 0, totalPages: 0, last: true });
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchExpenses();
    }, search ? 300 : 0); // Debounce search, instant for page change
    return () => clearTimeout(debounce);
  }, [fetchExpenses]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setEditingExpense(null);
    fetchExpenses(); // Refresh the list after save
  };

  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirmId === null) return;
    setDeleting(true);
    try {
      await expenseApi.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      fetchExpenses(); // Refresh list after delete
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="expense-list-page">
      <PageHeader
        title="Expenses"
        subtitle="Manage and track all your expenses"
        action={
          <Button icon={<Plus size={16} />} onClick={handleAdd}>
            Add Expense
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-search">
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={handleSearch}
            icon={<Search />}
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="expense-table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={4}><SkeletonRow /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : data.items.length > 0 ? (
        <>
          <div className="expense-table-wrapper">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>
                    <button className="sort-btn">
                      Title <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th>
                    <button className="sort-btn">
                      Amount <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th>
                    <button className="sort-btn">
                      Date <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((expense) => (
                  <tr key={expense.id} className="expense-row">
                    <td className="expense-title">{expense.title}</td>
                    <td className="expense-amount mono">{formatCurrency(expense.amount)}</td>
                    <td className="expense-date">{formatDate(expense.createdAt)}</td>
                    <td className="expense-actions">
                      <button
                        className="action-btn action-edit"
                        onClick={() => handleEdit(expense)}
                        aria-label={`Edit ${expense.title}`}
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="action-btn action-delete"
                        onClick={() => handleDelete(expense.id)}
                        aria-label={`Delete ${expense.title}`}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            onPageChange={setPage}
            totalElements={data.totalElements}
            pageSize={pageSize}
          />
        </>
      ) : (
        <EmptyState
          icon={<Receipt />}
          title={search ? 'No results found' : 'No expenses yet'}
          description={
            search
              ? 'Try adjusting your search terms'
              : 'Track your first expense to get started'
          }
          actionLabel={search ? 'Clear search' : 'Add Expense'}
          onAction={search ? () => setSearch('') : handleAdd}
        />
      )}

      {/* Add/Edit Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingExpense(null);
        }}
        onSaved={handleSaved}
        expense={editingExpense}
      />

      {/* Delete Confirmation */}
      {deleteConfirmId !== null && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteConfirmId(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Expense</h3>
            <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
            <div className="confirm-actions">
              <Button variant="secondary" onClick={() => setDeleteConfirmId(null)} disabled={deleting}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete} loading={deleting}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
