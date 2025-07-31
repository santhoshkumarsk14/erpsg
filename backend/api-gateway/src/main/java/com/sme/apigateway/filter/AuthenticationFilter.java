package com.sme.apigateway.filter;

import com.sme.apigateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Set;
import java.util.HashSet;
import java.util.Arrays;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    private static Set<String> ADMIN_IP_WHITELIST = new HashSet<>(Arrays.asList("127.0.0.1", "::1"));

    @Autowired
    public void setAdminIpWhitelist(@Value("${admin.ip.whitelist:127.0.0.1,::1}") String whitelist) {
        ADMIN_IP_WHITELIST = new HashSet<>();
        for (String ip : whitelist.split(",")) {
            ADMIN_IP_WHITELIST.add(ip.trim());
        }
    }

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();
            String remoteIp = request.getHeaders().getFirst("X-Forwarded-For");
            if (remoteIp == null) {
                remoteIp = request.getRemoteAddress() != null ? request.getRemoteAddress().getAddress().getHostAddress() : null;
            }
            // IP whitelist for admin endpoints
            if ((path.startsWith("/api/users/") || path.startsWith("/api/companies/")) &&
                    (remoteIp == null || !ADMIN_IP_WHITELIST.contains(remoteIp))) {
                return onError(exchange, "Access denied: IP not whitelisted", HttpStatus.FORBIDDEN);
            }

            // Skip authentication for auth endpoints
            if (request.getURI().getPath().contains("/api/auth/")) {
                return chain.filter(exchange);
            }

            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "No authorization header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid authorization header", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            try {
                if (!jwtUtil.validateToken(token)) {
                    return onError(exchange, "Invalid JWT token", HttpStatus.UNAUTHORIZED);
                }

                // Add user information to headers for downstream services
                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                        .header("X-User-ID", jwtUtil.getUserIdFromToken(token))
                        .header("X-User-Name", jwtUtil.getUsernameFromToken(token))
                        .header("X-Company-ID", jwtUtil.getCompanyIdFromToken(token))
                        .header("X-User-Role", jwtUtil.getRoleFromToken(token))
                        .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) {
                return onError(exchange, e.getMessage(), HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    public static class Config {
        // Put configuration properties here if needed
    }
}