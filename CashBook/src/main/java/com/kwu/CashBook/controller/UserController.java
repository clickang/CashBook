package com.kwu.CashBook.controller;

import com.kwu.CashBook.mapper.UserMapper;
import com.kwu.CashBook.model.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@RestController
public class UserController {

    private final UserMapper userMapper;

    public UserController(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    // 회원가입 처리
    @PostMapping("/register")
    public void registerUser(
            @RequestParam("username") String username,
            @RequestParam("email") String email,
            @RequestParam("loginId") String loginId,
            @RequestParam("password") String password,
            HttpServletResponse response
    ) throws IOException {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setLoginId(loginId);
        user.setPassword(password); // ⚠️ 지금은 평문, 추후 암호화 권장

        userMapper.insert(user);

        response.sendRedirect("/Boarding.html");
    }

    // 로그인 처리
    @PostMapping("/login")
    public void loginUser(
            @RequestParam("loginId") String loginId,
            @RequestParam("password") String password,
            HttpSession session,
            HttpServletResponse response
    ) throws IOException {
        User user = userMapper.findByLoginId(loginId);

        if (user != null && user.getPassword().equals(password)) {
            session.setAttribute("user", user);
            response.sendRedirect("/index.html");
        } else {
        	// 실패 시
            response.sendRedirect("/Boarding.html?error=true");
        }
    }

    
    @GetMapping("/session-user")
    public User getSessionUser(HttpSession session) {
        return (User) session.getAttribute("user");
    }
    
    @GetMapping("/logout")
    public void logout(HttpSession session, HttpServletResponse response) throws IOException {
        session.invalidate(); // 세션 무효화 (로그아웃 처리)
        response.sendRedirect("/Boarding.html"); // 로그인 화면으로 리다이렉트
    }
}
