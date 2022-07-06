package com.etf.ppis.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@EnableSwagger2
@RequestMapping("/api/test")
public class TestController {
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content.";
    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public String userAccess() {
        return "Client Content.";
    }
    @GetMapping("/service")
    @PreAuthorize("hasRole('SERVICE')")
    public String moderatorAccess() {
        return "Service Desk Board.";
    }
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin Board.";
    }

    @GetMapping("/approver")
    @PreAuthorize("hasRole('APPROVER')")
    public String approverAccess() {
        return "Change manager Board.";
    }

    @GetMapping("/developer")
    @PreAuthorize("hasRole('DEV')")
    public String developerAccess() {
        return "Developer Board.";
    }

}

