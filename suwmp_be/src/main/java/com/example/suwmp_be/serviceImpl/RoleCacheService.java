package com.example.suwmp_be.serviceImpl;

import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.entity.Role;
import com.example.suwmp_be.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.Map;

@Service
public class RoleCacheService {
    private final Map<RoleEnum, Role> roleMap = new EnumMap<>(RoleEnum.class);

    public RoleCacheService(RoleRepository roleRepository) {
        roleRepository.findAll().forEach(role -> {
            roleMap.put(RoleEnum.valueOf(role.getName()), role);
        });
    }

    public Role get(RoleEnum roleEnum) {
        Role role = roleMap.get(roleEnum);
        if (role == null) {
            throw new IllegalStateException("Role not found: " + roleEnum);
        }
        return role;
    }
}
