package com.kwu.CashBook.controller;

import com.kwu.CashBook.model.User;
import com.kwu.CashBook.mapper.TransactionMapper;
import jakarta.servlet.http.HttpSession;

import com.kwu.CashBook.model.Transaction;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
    public List<Transaction> getAll(
            @RequestParam(name = "startDate", required = false) String startDate,
            @RequestParam(name = "endDate", required = false) String endDate,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        if (user == null) return List.of(); // 로그인 안 했으면 빈 리스트

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        if (startDate == null || startDate.isEmpty()) {
            startDate = today.minusYears(3).format(formatter);
        }
        if (endDate == null || endDate.isEmpty()) {
            endDate = today.format(formatter);
        }

        return mapper.findByDateRange(user.getUserId(), startDate, endDate);
    }
    
    @PostMapping
    public void insert(@RequestBody Transaction transaction, HttpSession session) {
        User user = (User) session.getAttribute("user"); // 로그인한 사용자
        transaction.setUserId(user.getUserId());         // 거래에 userId 세팅
        mapper.insert(transaction);                      // DB에 삽입
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
    @GetMapping("/{id}")
    public Transaction findById(@PathVariable("id") Long id) {
        return mapper.findById(id);
    }

    
    // 날짜 범위로 거래 조회
    @GetMapping("/search")
    public List<Transaction> getByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate,
            HttpSession session
    ) {
        User user = (User) session.getAttribute("user");
        if (user == null) return List.of();

        return mapper.findByDateRange(user.getUserId(), startDate, endDate);
    }


    // 카테고리별 거래 조회
    @GetMapping("/category/{categoryId}")
    public List<Transaction> getByCategory(@PathVariable("categoryId") Long categoryId) {
        return mapper.findByCategory(categoryId);
    } 
        
    /* 통계 기능 */
    // 월별 수입/지출 합계
    @GetMapping("/summary/monthly")
    public Map<String, Object> getMonthlySummary(@RequestParam("month") String month, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return Map.of();
        return mapper.getMonthlySummary(month, user.getUserId());
    }

    // 카테고리별 지출 통계
    @GetMapping("/summary/category")
    public List<Map<String, Object>> getCategorySummary(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) return List.of();
        return mapper.getCategorySummary(user.getUserId());
    }

}