package com.expensetrackerapi.trackexpense.dto;

import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@NoArgsConstructor
public class ExpenseResponse implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long id;
    private String title;
    private Double amount;
    private LocalDateTime createdAt;
    private LocalDateTime lastModified;

    public ExpenseResponse(Long id, String title, double amount, LocalDateTime createdAt, LocalDateTime lastModified) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.createdAt = createdAt;
        this.lastModified = lastModified;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public double getAmount() {
        return amount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastModified() {
        return lastModified;
    }
}
