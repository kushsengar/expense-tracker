package com.expensetrackerapi.trackexpense.controller;

import com.expensetrackerapi.trackexpense.dto.ExpenseFilter;
import com.expensetrackerapi.trackexpense.dto.ExpenseRequest;
import com.expensetrackerapi.trackexpense.dto.ExpenseResponse;
import com.expensetrackerapi.trackexpense.dto.PaginatedResponse;
import com.expensetrackerapi.trackexpense.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

@Validated
@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "server is up and running";
    }

    @GetMapping
    public PaginatedResponse<ExpenseResponse> getExpenses(ExpenseFilter filter, Pageable pageable) {
        return expenseService.getAllExpenses(filter, pageable);
    }

    @GetMapping("/{id}")
    public ExpenseResponse getExpenseById(@PathVariable Long id) {
        return expenseService.toExpenseResponse(expenseService.getExpenseById(id));
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody ExpenseRequest expenseRequest) {
        System.out.println("CONTROLLER HIT");
        return new ResponseEntity<>(expenseService.createExpense(expenseRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest expenseRequest) {
        return expenseService.updateExpense(expenseRequest, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpenseById(@PathVariable Long id) {
        return expenseService.deleteExpenseById(id);
    }
}
