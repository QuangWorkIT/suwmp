package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
@RequestMapping("/api/users")
public class UserController {
    private final IUserService userService;

    @GetMapping
    public ResponseEntity<BaseResponse<Page<UserResponse>>> getAllUsers(
            @PageableDefault(size = 6)
            Pageable pageable)
    {
        Page<UserResponse> allUsers = userService.getAllUsers(pageable);
        return ResponseEntity.ok(new BaseResponse<>(true, "Users retrieve successfully", allUsers));
    }
}
