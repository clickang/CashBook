package com.kwu.CashBook.mapper;

import org.apache.ibatis.annotations.Param;
import com.kwu.CashBook.model.Transaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;
@Mapper
public interface TransactionMapper {
    List<Transaction> findAll();
    void insert(Transaction transaction);
    void update(Transaction transaction);
    void delete(Long id);
    
    Transaction findById(Long id);
    List<Transaction> findByDateRange(@Param("userId") Long userId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);
    List<Transaction> findByCategory(Long categoryId);
    
    Map<String, Object> getMonthlySummary(@Param("month") String month, @Param("userId") Long userId);
    List<Map<String, Object>> getCategorySummary(@Param("userId") Long userId);
}