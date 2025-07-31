package com.sme.appendixservice.repository;

import com.sme.appendixservice.model.AppendixItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppendixItemRepository extends JpaRepository<AppendixItem, Long> {
    List<AppendixItem> findAllByAppendixId(Long appendixId);
} 