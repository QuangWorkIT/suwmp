package com.example.suwmp_be.config;

import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.entity.EnterpriseUser;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.serviceImpl.RoleCacheService;
import com.example.suwmp_be.repository.EnterpriseUserRepository;
import com.example.suwmp_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final EnterpriseUserRepository enterpriseUserRepository;
        private final RoleCacheService roleCacheService;
        private final PasswordEncoder passwordEncoder;

        @Override
        @Transactional
        public void run(String... args) {

                if (userRepository.count() > 0) {
                        System.out.println("⚙️ Users already exist. Seeder skipped.");
                        return;
                }

                System.out.println("🌱 Seeding users using RoleCacheService...");

                List<User> users = new ArrayList<>();
                /*
                 * ============================
                 * ADMINS (2)
                 * ============================
                 */
                users.add(User.builder()
                                .fullName("System Admin One")
                                .email("admin1@suwmp.com")
                                .phone("0988888881")
                                .passwordHash(passwordEncoder.encode("Admin@123"))
                                .role(roleCacheService.get(RoleEnum.ADMIN))
                                .status("ACTIVE")
                                .build());

                users.add(User.builder()
                                .fullName("System Admin Two")
                                .email("admin2@suwmp.com")
                                .phone("0988888882")
                                .passwordHash(passwordEncoder.encode("Admin@123"))
                                .role(roleCacheService.get(RoleEnum.ADMIN))
                                .status("ACTIVE")
                                .build());

                userRepository.saveAll(users);

                System.out.println("✅ Seed completed:");
                System.out.println("   - 2 ADMINS");
        }
}
