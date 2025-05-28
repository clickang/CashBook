package com.kwu.CashBook.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BoardingController {

    @GetMapping("/")
    public String redirectToBoarding() {
        return "redirect:/Boarding.html"; // ✅ static/Boarding.html 로 리다이렉트
    }
}