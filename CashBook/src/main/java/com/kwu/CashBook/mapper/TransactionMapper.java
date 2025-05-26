package com.kwu.CashBook.mapper;


import com.kwu.CashBook.model.Transaction;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TransactionMapper {
    List<Transaction> findAll();
    void insert(Transaction transaction);
    void update(Transaction transaction);
    void delete(Long id);
    
    Transaction findById(Long id);
    List<Transaction> findByDateRange(@Param("startDate") String startDate, @Param("endDate") String endDate);
    List<Transaction> findByCategory(Long categoryId);
}