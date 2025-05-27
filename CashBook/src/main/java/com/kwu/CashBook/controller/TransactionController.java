package com.kwu.CashBook.controller;

import com.kwu.CashBook.mapper.TransactionMapper;
import com.kwu.CashBook.model.Transaction;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    
    /* 세부 조회 기능 */
    
    // 날짜 범위로 거래 조회
    @GetMapping("/search")
    public List<Transaction> getByDateRange(
        @RequestParam("startDate") String startDate, 
        @RequestParam("endDate") String endDate) {
        return mapper.findByDateRange(startDate, endDate);
    }

    // 카테고리별 거래 조회
    @GetMapping("/category/{categoryId}")
    public List<Transaction> getByCategory(@PathVariable("categoryId") Long categoryId) {
        return mapper.findByCategory(categoryId);
    } 
        
    /* 통계 기능 */
    // 월별 수입/지출 합계
    @GetMapping("/summary/monthly")
    public Map<String, Object> getMonthlySummary(@RequestParam("month") String month) {
        return mapper.getMonthlySummary(month);
    }

    // 카테고리별 지출 통계
    @GetMapping("/summary/category")
    public List<Map<String, Object>> getCategorySummary() {
        return mapper.getCategorySummary();
    }
}