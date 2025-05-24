package com.kwu.CashBook.mapper;


import com.kwu.CashBook.model.Transaction;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TransactionMapper {
    List<Transaction> findAll();
    void insert(Transaction transaction);
}