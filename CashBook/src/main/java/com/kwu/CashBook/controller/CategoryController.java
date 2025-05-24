package com.kwu.CashBook.controller;

import com.kwu.CashBook.mapper.CategoryMapper;
import com.kwu.CashBook.model.Category;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryMapper mapper;

    public CategoryController(CategoryMapper mapper) {
        this.mapper = mapper;
    }

    @GetMapping
    public List<Category> getAll() {
        return mapper.findAll();
    }

    @PostMapping
    public void insert(@RequestBody Category category) {
        mapper.insert(category);
    }
}