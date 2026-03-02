package com.expensetrackerapi.trackexpense.respository;

import com.expensetrackerapi.trackexpense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    boolean existsById(Long id);
}
