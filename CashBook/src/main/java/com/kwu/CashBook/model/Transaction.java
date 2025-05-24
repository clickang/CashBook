package com.kwu.CashBook.model;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class Transaction {
    private Long id;
    private Date transactionDate;
    private String itemName;
    private int amount;
    private String type;
    private String memo;
    private Long categoryId;
}
