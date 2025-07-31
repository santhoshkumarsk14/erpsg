package com.sme.appendixservice.service;

import com.sme.appendixservice.model.AppendixItem;
import java.util.List;

public interface AppendixItemService {
    List<AppendixItem> getItemsByAppendix(Long appendixId);
    AppendixItem createItem(AppendixItem item);
    AppendixItem updateItem(Long itemId, AppendixItem item);
    void deleteItem(Long itemId);
    List<AppendixItem> bulkUpdateItems(Long appendixId, List<AppendixItem> items);
} 