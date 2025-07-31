# Shared Backend Library

This folder contains shared DTOs, error classes, and utilities for all backend microservices.

## Contents
- `ApiResponse.java`: Standard API response wrapper
- `ApiException.java`: Custom exception for unified error handling
- `CompanyContext.java`: Thread-local company context for multi-tenancy
- `GlobalExceptionHandler.java`: Global error handler for Spring Boot

## Usage
- Import these classes in your microservices for consistent API responses, error handling, and multi-tenancy enforcement. 