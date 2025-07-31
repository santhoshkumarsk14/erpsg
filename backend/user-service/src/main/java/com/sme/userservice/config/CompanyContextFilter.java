package com.sme.userservice.config;

import com.sme.shared.CompanyContext;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class CompanyContextFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String companyIdHeader = httpRequest.getHeader("X-Company-ID");
        if (companyIdHeader != null) {
            try {
                CompanyContext.setCompanyId(Long.parseLong(companyIdHeader));
            } catch (NumberFormatException ignored) {}
        }
        try {
            chain.doFilter(request, response);
        } finally {
            CompanyContext.clear();
        }
    }
} 