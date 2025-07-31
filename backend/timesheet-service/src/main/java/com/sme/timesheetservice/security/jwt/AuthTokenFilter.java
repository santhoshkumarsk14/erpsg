package com.sme.timesheetservice.security.jwt;

import com.sme.timesheetservice.security.services.UserDetailsImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                if ("PROXY_AUTH".equals(jwt)) {
                    // Handle proxy authentication
                    String userId = (String) request.getAttribute("userId");
                    String username = (String) request.getAttribute("username");
                    String companyId = (String) request.getAttribute("companyId");
                    String rolesStr = (String) request.getAttribute("roles");
                    
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    if (rolesStr != null && !rolesStr.isEmpty()) {
                        String[] roleArray = rolesStr.split(",");
                        for (String role : roleArray) {
                            authorities.add(new SimpleGrantedAuthority(role.trim()));
                        }
                    }
                    
                    UserDetailsImpl userDetails = new UserDetailsImpl(userId, username, companyId, authorities);
                    
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, userId, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // Handle JWT authentication
                    String username = jwtUtils.getUserNameFromJwtToken(jwt);
                    String userId = jwtUtils.getUserIdFromJwtToken(jwt);
                    String companyId = jwtUtils.getCompanyIdFromJwtToken(jwt);
                    List<String> roles = jwtUtils.getRolesFromJwtToken(jwt);

                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    UserDetailsImpl userDetails = new UserDetailsImpl(userId, username, companyId, authorities);

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        // Check for headers set by API Gateway
        String userId = request.getHeader("X-User-ID");
        String username = request.getHeader("X-User-Name");
        String companyId = request.getHeader("X-Company-ID");
        String roles = request.getHeader("X-User-Roles");

        if (StringUtils.hasText(userId) && StringUtils.hasText(username)) {
            logger.debug("Found user info in headers: {} - {}", userId, username);
            
            // Store the user ID in the request attributes for later retrieval
            request.setAttribute("userId", userId);
            request.setAttribute("username", username);
            request.setAttribute("companyId", companyId);
            request.setAttribute("roles", roles);
            
            return "PROXY_AUTH";
        }

        return null;
    }
}