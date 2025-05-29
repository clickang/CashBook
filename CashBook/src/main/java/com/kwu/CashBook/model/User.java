package com.kwu.CashBook.model;

import java.util.Date;

public class User {
    private Long userId;        // PK
    private String username;    // 이름
    private String email;       // 이메일
    private String loginId;     // 로그인 아이디
    private String password;    // 비밀번호
    private Date createdAt;     // 가입일

    // 기본 생성자
    public User() {
    }

    // Getter & Setter
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLoginId() {
        return loginId;
    }

    public void setLoginId(String loginId) {
        this.loginId = loginId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
