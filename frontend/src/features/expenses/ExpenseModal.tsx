import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { expenseApi } from '../../api/expenses';
import type { Expense } from '../../api/expenses';
import './ExpenseModal.css';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  expense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  expense,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const isEditing = !!expense;

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setAmount(String(expense.amount));
    } else {
      setTitle('');
      setAmount('');
    }
    setErrors({});
    setApiError('');
  }, [expense, isOpen]);

  const validate = () => {
    const errs: { title?: string; amount?: string } = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      errs.amount = 'Enter a valid amount greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const payload = { title: title.trim(), amount: Number(amount) };
      if (isEditing && expense) {
        await expenseApi.update(expense.id, payload);
      } else {
        await expenseApi.create(payload);
      }
      onSaved(); // Notify parent to refresh + close
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.title || 'Failed to save. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit} className="expense-form">
        {apiError && <div className="expense-form-error">{apiError}</div>}
        <Input
          label="Title"
          placeholder="e.g. Groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />
        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          min="0.01"
          step="0.01"
        />
        <div className="expense-form-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEditing ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
