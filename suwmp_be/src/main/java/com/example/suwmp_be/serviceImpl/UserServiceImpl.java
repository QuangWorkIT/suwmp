package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.dto.mapper.UserMapper;
import com.example.suwmp_be.dto.response.UserResponse;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.repository.UserRepository;
import com.example.suwmp_be.service.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements IUserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        return userMapper.toPageResponse(page);
    }
}
