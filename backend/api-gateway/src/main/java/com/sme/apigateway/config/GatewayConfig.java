package com.sme.apigateway.config;

import com.sme.apigateway.filter.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Autowired
    private AuthenticationFilter authFilter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("user-service-auth", r -> r.path("/api/auth/**")
                .uri("http://localhost:8081"))
            .route("user-service", r -> r.path("/api/users/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8092"))
            .route("company-service", r -> r.path("/api/companies/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8082"))
            .route("timesheet-service", r -> r.path("/api/timesheets/**", "/api/tasks/**", "/api/projects/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8083"))
            .route("payroll-service", r -> r.path("/api/payrolls/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8084"))
            .route("hr-service", r -> r.path("/api/employees/**", "/api/attendance/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8085"))
            .route("invoice-service", r -> r.path("/api/invoices/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8086"))
            .route("quote-service", r -> r.path("/api/quotes/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8087"))
            .route("procurement-service", r -> r.path("/api/purchase-orders/**", "/api/inventory-items/**", "/api/suppliers/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8088"))
            .route("appendix-service", r -> r.path("/api/appendices/**", "/api/appendix-items/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8089"))
            .route("leave-service", r -> r.path("/api/leaves/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8090"))
            .route("tools-equipment-service", r -> r.path("/api/tools/**", "/api/tool-transactions/**")
                .filters(f -> f.filter(authFilter.apply(new AuthenticationFilter.Config())))
                .uri("http://localhost:8091"))
            .build();
    }
}