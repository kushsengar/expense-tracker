package com.expensetrackerapi.trackexpense.exception;

public class ExpenseNotFoundException extends RuntimeException {
    private final Long ExpenseId;

    public ExpenseNotFoundException(Long id) {
        super("Expense not found with id: ");
        this.ExpenseId = id;
    }

    public Long getExpenseId() {
        return ExpenseId;
    }
}
