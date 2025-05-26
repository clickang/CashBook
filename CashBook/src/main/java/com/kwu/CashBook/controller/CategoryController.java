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
    
    @PutMapping("/{id}")
    public void update(@PathVariable("id") Long id, @RequestBody Category category) {
        category.setCategoryId(id); // ID 설정
        mapper.update(category);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        mapper.delete(id);
    }
}