package com.sme.quoteservice.repository;

import com.sme.quoteservice.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuoteRepository extends JpaRepository<Quote, Long> {
    List<Quote> findAllByCompanyId(Long companyId);
    Quote findTopByCompanyIdOrderByIdDesc(Long companyId);
} 