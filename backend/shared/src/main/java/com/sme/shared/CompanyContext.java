package com.sme.shared;

public class CompanyContext {
    private static final ThreadLocal<Long> companyIdHolder = new ThreadLocal<>();

    public static void setCompanyId(Long companyId) {
        companyIdHolder.set(companyId);
    }

    public static Long getCompanyId() {
        return companyIdHolder.get();
    }

    public static void clear() {
        companyIdHolder.remove();
    }
} 