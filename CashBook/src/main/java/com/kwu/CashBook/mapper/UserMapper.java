package com.kwu.CashBook.mapper;

import com.kwu.CashBook.model.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    void insert(User user);
    User findByLoginId(String loginId);
}
