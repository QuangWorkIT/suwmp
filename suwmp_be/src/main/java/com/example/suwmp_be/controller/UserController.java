package com.example.suwmp_be.controller;

import com.example.suwmp_be.dto.BaseResponse;
import com.example.suwmp_be.dto.request.CreateUserRequest;
import com.example.suwmp_be.dto.request.UpdateUserRequest;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.service.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final IUserService userService;

    @GetMapping
    public ResponseEntity<BaseResponse<Page<UserResponse>>> getAllUsers(
            @PageableDefault(size = 6)
            Pageable pageable)
    {
        Page<UserResponse> allUsers = userService.getAllUsers(pageable);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Users retrieve successfully",
                allUsers));
    }

    @GetMapping("/search")
    public ResponseEntity<BaseResponse<Page<UserResponse>>> searchUsers(
            @PageableDefault(size = 6)
            Pageable pageable,
            @RequestParam(required = false) String keyword
    ) {
        Page<UserResponse> users = userService.searchUsersByFullNameOrEmail(pageable, keyword);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "Users search successfully",
                users));
    }

    @PostMapping
    public ResponseEntity<BaseResponse<UserResponse>> createUser(
            @Valid  @RequestBody CreateUserRequest request
            )
    {
        // Implementation for creating a user would go here
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "User created successfully",
                userService.createUser(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BaseResponse<UserResponse>> updateUser(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "User updated successfully",
                userService.updateUser(id, request)
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteUser(
            @PathVariable UUID id
    ) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new BaseResponse<>(
                true,
                "User deleted successfully",
                null));
    }

}
