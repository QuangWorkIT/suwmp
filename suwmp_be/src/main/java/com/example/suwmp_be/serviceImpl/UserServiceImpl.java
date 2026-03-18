package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.ErrorCode;
import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.dto.mapper.UserMapper;
import com.example.suwmp_be.dto.request.CreateUserRequest;
import com.example.suwmp_be.dto.request.UpdateUserRequest;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.entity.Enterprise;
import com.example.suwmp_be.entity.EnterpriseUser;
import com.example.suwmp_be.entity.Role;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.exception.NotFoundException;
import com.example.suwmp_be.repository.EnterpriseRepository;
import com.example.suwmp_be.repository.EnterpriseUserRepository;
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
import java.time.LocalDateTime;
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
    private final EnterpriseRepository enterpriseRepository;
    private final EnterpriseUserRepository enterpriseUserRepository;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> page = userRepository.findByDeletedAtIsNull(pageable);
        return userMapper.toPageResponse(page);
    }

    @Override
    public Page<UserResponse> searchUsersByFullNameOrEmail(Pageable pageable, String keyword) {
        Page<User> page = userRepository.searchUser(pageable, keyword);
        return userMapper.toPageResponse(page);
    }

    @Transactional
    @Override
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already exists: " + request.getPhone());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + request.getRoleId()));

        // create user
        User user = userRepository.save(User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(role)
                .status("ACTIVE")
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .createdAt(Instant.now())
                .build());

        // create enterprise
        if (RoleEnum.ENTERPRISE == RoleEnum.fromId(role.getId())) {
            Enterprise enterprise = Enterprise.builder()
                    .name(request.getEnterpriseName())
                    .photoUrl(request.getEnterprisePhoto())
                    .description(request.getEnterpriseDescription())
                    .rating(4.0f)
                    .createdAt(LocalDateTime.now())
                    .build();

            long enterpriseId = enterpriseRepository.save(enterprise).getId();

            enterpriseUserRepository.save(
                    EnterpriseUser.builder()
                            .enterpriseId(enterpriseId)
                            .userId(user.getId())
                            .createAt(LocalDateTime.now())
                            .build()
            );
        }

        return userMapper.toResponse(user);
    }

    @Transactional
    @Override
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (userRepository.existsByPhoneAndIdNot(request.getPhone(), userId)) {
            throw new RuntimeException("Phone number already exists: " + request.getPhone());
        }
        if (userRepository.existsByEmailAndIdNot(request.getEmail(), userId)) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        RoleEnum currentRole = RoleEnum.fromId(user.getRole().getId());
        RoleEnum targetRole = RoleEnum.fromId(role.getId());
        EnterpriseUser enterpriseUser = enterpriseUserRepository.findByUserId(userId).orElse(null);

        if (RoleEnum.ENTERPRISE == targetRole) {
            upsertEnterprise(user, request, enterpriseUser);
        } else if (RoleEnum.ENTERPRISE == currentRole) {
            // soft delete enterprise if downgrade from enterprise to other role
            softDeleteEnterprise(enterpriseUser);
        }

        // update user info
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setStatus(request.getStatus());
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        return userMapper.toResponse(user);
    }


    @Override
    public void deleteUser(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (RoleEnum.ENTERPRISE == RoleEnum.fromId(user.getRole().getId())) {
            EnterpriseUser enterpriseUser = enterpriseUserRepository.findByUserId(userId).orElse(null);
            softDeleteEnterprise(enterpriseUser);
        }

        user.setDeletedAt(Instant.now());
        userRepository.save(user);
    }


    private void upsertEnterprise(User user, UpdateUserRequest request, EnterpriseUser enterpriseUser) {
        if (enterpriseUser == null) {
            long enterpriseId = enterpriseRepository.save(Enterprise.builder()
                    .name(request.getEnterpriseName())
                    .photoUrl(request.getEnterprisePhoto())
                    .description(request.getEnterpriseDescription())
                    .rating(4.0f)
                    .createdAt(LocalDateTime.now())
                    .build()).getId();

            enterpriseUserRepository.save(
                    EnterpriseUser.builder()
                            .enterpriseId(enterpriseId)
                            .userId(user.getId())
                            .createAt(LocalDateTime.now())
                            .build()
            );
            return;
        }

        Enterprise enterprise = enterpriseRepository.findById(enterpriseUser.getEnterpriseId())
                .orElseThrow(() -> new NotFoundException(ErrorCode.ENTERPRISE_NOT_FOUND));

        enterprise.setName(request.getEnterpriseName());
        enterprise.setDescription(request.getEnterpriseDescription());
        enterprise.setPhotoUrl(request.getEnterprisePhoto());
        enterprise.setDeletedAt(null);
        enterpriseRepository.save(enterprise);
    }


    private void softDeleteEnterprise(EnterpriseUser enterpriseUser) {
        if (enterpriseUser == null) {
            return;
        }

        enterpriseRepository.findById(enterpriseUser.getEnterpriseId())
                .ifPresent(enterprise -> {
                    enterprise.setDeletedAt(LocalDateTime.now());
                    enterpriseRepository.save(enterprise);
                });
    }


    private String generateTempPassword() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
