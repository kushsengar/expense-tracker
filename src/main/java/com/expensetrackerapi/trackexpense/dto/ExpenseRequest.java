package com.expensetrackerapi.trackexpense.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class ExpenseRequest {

    @NotBlank(message = "Title should not be blank")
    private String title;

    @Positive(message = "Amount should be greater than 0")
    private Double amount;

    public ExpenseRequest() {
    }

    public ExpenseRequest(String title, Double amount) {
        this.title = title;
        this.amount = amount;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
