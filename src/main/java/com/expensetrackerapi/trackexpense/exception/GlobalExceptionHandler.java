package com.expensetrackerapi.trackexpense.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

        /* ---------------- VALIDATION ( @Valid ) ---------------- */

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiError> handleMethodArgumentNotValid(
                        MethodArgumentNotValidException ex,
                        HttpServletRequest request) {

                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult().getFieldErrors()
                                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

                ApiError apiError = new ApiError(
                                400,
                                "Bad Request",
                                "Validation failed",
                                request.getRequestURI());

                apiError.setValidationErrors(errors);

                return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
        }

        /* ---------------- HIBERNATE VALIDATION ---------------- */

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ApiError> handleConstraintViolation(
                        ConstraintViolationException ex,
                        HttpServletRequest request) {

                String message = ex.getConstraintViolations()
                                .iterator()
                                .next()
                                .getMessage();

                ApiError apiError = new ApiError(
                                400,
                                "Bad Request",
                                message,
                                request.getRequestURI());

                return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
        }

        /* ---------------- ENTITY NOT FOUND ---------------- */

        @ExceptionHandler(RuntimeException.class)
        public ResponseEntity<ApiError> handleRuntime(
                        RuntimeException ex,
                        HttpServletRequest request) {

                ApiError apiError = new ApiError(
                                500,
                                "Internal Server Error",
                                ex.getMessage(),
                                request.getRequestURI());

                return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        /* ---------------- LAST RESORT (IMPORTANT) ---------------- */

//        @ExceptionHandler(Exception.class)
//        public ResponseEntity<ApiError> handleAll(
//                        Exception ex,
//                        HttpServletRequest request) {
//
//                ApiError apiError = new ApiError(
//                                500,
//                                "Internal Server Error",
//                                "Something went wrong",
//                                request.getRequestURI());
//
//                return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
//        }

        /*--------------------EXPENSE NOT FOUND---------------------*/

        @ExceptionHandler(ExpenseNotFoundException.class)
        @ResponseStatus(HttpStatus.NOT_FOUND)
        public ResponseEntity<?> handleExpenseNotFound(ExpenseNotFoundException ex, HttpServletRequest request) {

                // Map<String, String> error = new HashMap<>();
                // error.put("message", ex.getMessage());
                ApiError apiError = new ApiError(
                                HttpStatus.NOT_FOUND.value(),
                                HttpStatus.NOT_FOUND.getReasonPhrase(),
                                ex.getMessage(),
                                request.getRequestURI());
                return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        @ResponseStatus(HttpStatus.BAD_REQUEST)
        public ResponseEntity<ApiError> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
                        HttpServletRequest request) {
                ApiError apiError = new ApiError(
                                400, "Bad Request", "Malformed JSON request or BAD Data Type", request.getRequestURI());
                return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
        }
}
