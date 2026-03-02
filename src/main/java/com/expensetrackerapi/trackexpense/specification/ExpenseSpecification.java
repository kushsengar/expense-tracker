package com.expensetrackerapi.trackexpense.specification;

import com.expensetrackerapi.trackexpense.entity.Expense;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class ExpenseSpecification {
    public static Specification<Expense> hasMinAmount(Double minAmount) {
        return (root, query, criteriaBuilder) -> {
            if (minAmount == null) {
                return null;
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get("amount"), minAmount);
        };
    }

    public static Specification<Expense> hasMaxAmount(Double maxAmount) {
        return (root, query, criteriaBuilder) -> {
            if (maxAmount == null) {
                return null;
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get("amount"), maxAmount);
        };
    }

    public static Specification<Expense> titleContains(String title) {
        return (root, query, criteriaBuilder) -> {

            if (title == null || title.trim().isEmpty()) {
                return null;
            }

            return criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    "%" + title.toLowerCase() + "%");
        };
    }

    public static Specification<Expense> fromDate(LocalDate fromDate) {
        return (root, query, cb) -> {
            if (fromDate == null)
                return null;

            return cb.greaterThanOrEqualTo(
                    root.get("createdAt"),
                    fromDate.atStartOfDay());
        };
    }

    public static Specification<Expense> toDate(LocalDate toDate) {
        return (root, query, cb) -> {
            if (toDate == null)
                return null;

            return cb.lessThan(
                    root.get("createdAt"),
                    toDate.plusDays(1).atStartOfDay());
        };
    }

}
