package com.expensetrackerapi.trackexpense.service;

import com.expensetrackerapi.trackexpense.dto.ExpenseFilter;
import com.expensetrackerapi.trackexpense.dto.ExpenseRequest;
import com.expensetrackerapi.trackexpense.dto.ExpenseResponse;
import com.expensetrackerapi.trackexpense.dto.PaginatedResponse;
import com.expensetrackerapi.trackexpense.entity.Expense;
import com.expensetrackerapi.trackexpense.exception.ExpenseNotFoundException;
import com.expensetrackerapi.trackexpense.respository.ExpenseRepository;
import com.expensetrackerapi.trackexpense.specification.ExpenseSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;

import java.util.Set;

@Service
public class ExpenseService {
    // private List<Expense> expenses = new ArrayList<>();
    private static final int MAX_PAGE_SIZE = 50;
    private static final int DEFAULT_PAGE_SIZE = 10;
    private final ExpenseRepository expenseRepository;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("id", "title", "amount", "createdAt");

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ExpenseResponse toExpenseResponse(Expense expense) {
        return new ExpenseResponse(expense.getId(), expense.getTitle(), expense.getAmount(), expense.getCreatedAt(),
                expense.getLastModified());
    }

    public PaginatedResponse<ExpenseResponse> getAllExpenses(ExpenseFilter filter, Pageable pageable) {
        int page = pageable.getPageNumber();
        int size = pageable.getPageSize();
        if (size <= 0) {
            size = DEFAULT_PAGE_SIZE;
        }
        if (size > MAX_PAGE_SIZE) {
            size = MAX_PAGE_SIZE;
        }
        if (filter.getFromDate() != null && filter.getToDate() != null &&
                filter.getFromDate().isAfter(filter.getToDate())) {
            throw new IllegalArgumentException("fromDate cannot be after toDate");
        }
        Specification<Expense> spec = Specification.allOf();
        spec = spec.and(ExpenseSpecification.hasMinAmount(filter.getMinAmount()));
        spec = spec.and(ExpenseSpecification.hasMaxAmount(filter.getMaxAmount()));
        spec = spec.and(ExpenseSpecification.titleContains(filter.getTitle()));
        spec = spec.and(ExpenseSpecification.fromDate(filter.getFromDate()));
        spec = spec.and(ExpenseSpecification.toDate(filter.getToDate()));
        Pageable safePageable = PageRequest.of(page, size, pageable.getSort());
        Page<Expense> expensePage = expenseRepository.findAll(spec, safePageable);
        Page<ExpenseResponse> dtopage = expensePage.map(this::toExpenseResponse);
        PaginatedResponse<ExpenseResponse> response = new PaginatedResponse<>();
        response.setItems(dtopage.getContent());
        response.setTotalPages(dtopage.getTotalPages());
        response.setPage(dtopage.getNumber());
        response.setSize(dtopage.getSize());
        response.setTotalElements(dtopage.getTotalElements());
        response.setLast(dtopage.isLast());
        return response;
    }

    public ExpenseResponse createExpense(ExpenseRequest expenseRequest) {
        Expense expense = new Expense();
        expense.setTitle(expenseRequest.getTitle());
        expense.setAmount(expenseRequest.getAmount());
        return toExpenseResponse(expenseRepository.save(expense));
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
    }

    public ResponseEntity<ExpenseResponse> updateExpense(ExpenseRequest expenseRequest, Long id) {
        Expense expense1 = expenseRepository.findById(id).orElse(null);
        if (expense1 != null) {
            expense1.setTitle(expenseRequest.getTitle());
            expense1.setAmount(expenseRequest.getAmount());
            expenseRepository.save(expense1);
            return new ResponseEntity<>(toExpenseResponse(expense1), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<Object> deleteExpenseById(Long id) {
        if (expenseRepository.existsById(id)) {
            expenseRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
