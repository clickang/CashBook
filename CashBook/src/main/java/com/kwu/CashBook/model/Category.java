package com.kwu.CashBook.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class Category {
    private Long categoryId;
    private String name;
    private String type; // 수입 or 지출
}

