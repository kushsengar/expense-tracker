package com.expensetrackerapi.trackexpense.respository;

import com.expensetrackerapi.trackexpense.entity.Expense;
import com.expensetrackerapi.trackexpense.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    boolean existsById(Long id);
    Page<Expense> findByUser(User user, Pageable pageable);
}
