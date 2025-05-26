package com.kwu.CashBook.controller;

import com.kwu.CashBook.mapper.TransactionMapper;
import com.kwu.CashBook.model.Transaction;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionMapper mapper;

    public TransactionController(TransactionMapper mapper) {
        this.mapper = mapper;
    }

    @GetMapping
    public List<Transaction> getAll() {
        return mapper.findAll();
    }

    @PostMapping
    public void insert(@RequestBody Transaction transaction) {
        mapper.insert(transaction);
    }
    
    @PutMapping("/{id}")
    public void update(@PathVariable("id") Long id, @RequestBody Transaction transaction) {
        transaction.setId(id); 
        mapper.update(transaction);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        mapper.delete(id);
    }
}