package com.sme.appendixservice.service.impl;

import com.sme.appendixservice.model.AppendixItem;
import com.sme.appendixservice.repository.AppendixItemRepository;
import com.sme.appendixservice.service.AppendixItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AppendixItemServiceImpl implements AppendixItemService {
    @Autowired
    private AppendixItemRepository appendixItemRepository;

    @Override
    public List<AppendixItem> getItemsByAppendix(Long appendixId) {
        return appendixItemRepository.findAllByAppendixId(appendixId);
    }

    @Override
    public AppendixItem createItem(AppendixItem item) {
        return appendixItemRepository.save(item);
    }

    @Override
    public AppendixItem updateItem(Long itemId, AppendixItem item) {
        AppendixItem existing = appendixItemRepository.findById(itemId).orElseThrow();
        existing.setDescription(item.getDescription());
        existing.setStatus(item.getStatus());
        return appendixItemRepository.save(existing);
    }

    @Override
    public void deleteItem(Long itemId) {
        appendixItemRepository.deleteById(itemId);
    }

    @Override
    public List<AppendixItem> bulkUpdateItems(Long appendixId, List<AppendixItem> items) {
        List<AppendixItem> existingItems = appendixItemRepository.findAllByAppendixId(appendixId);
        for (AppendixItem update : items) {
            for (AppendixItem existing : existingItems) {
                if (existing.getId().equals(update.getId())) {
                    existing.setDescription(update.getDescription());
                    existing.setStatus(update.getStatus());
                }
            }
        }
        return appendixItemRepository.saveAll(existingItems);
    }
} 