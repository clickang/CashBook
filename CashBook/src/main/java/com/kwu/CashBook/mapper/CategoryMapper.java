package com.kwu.CashBook.mapper;

import com.kwu.CashBook.model.Category;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CategoryMapper {
    List<Category> findAll();
    void insert(Category category);
}