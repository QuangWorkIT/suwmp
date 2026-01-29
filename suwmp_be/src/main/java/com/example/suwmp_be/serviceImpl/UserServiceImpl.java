package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.mapper.UserMapper;
import com.example.suwmp_be.dto.request.CreateUserRequest;
import com.example.suwmp_be.dto.request.UpdateUserRequest;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.entity.Role;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.repository.RoleRepository;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements IUserService {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> page = userRepository.findByDeletedAtIsNull(pageable);
        return userMapper.toPageResponse(page);
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + request.getRoleId()));

        User user = userMapper.toEntity(request);
        user.setRole(role);

        user.setStatus("ACTIVE");
        user.setPasswordHash(passwordEncoder.encode(generateTempPassword()));
        user.setCreatedAt(Instant.now());

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateEntity(request, user);

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRole(role);

        userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Override
    public void deleteUser(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setDeletedAt(Instant.now());
        userRepository.save(user);
    }


    private String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
