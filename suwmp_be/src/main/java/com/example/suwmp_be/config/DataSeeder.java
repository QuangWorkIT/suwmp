package com.example.suwmp_be.config;

import com.example.suwmp_be.constants.RoleEnum;
import com.example.suwmp_be.entity.User;
import com.example.suwmp_be.serviceImpl.RoleCacheService;
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
@Profile({"dev", "test"})
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
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

        /* ============================
           CITIZENS (10)
        ============================ */
        for (int i = 1; i <= 10; i++) {
            users.add(User.builder()
                    .fullName("Demo Citizen " + i)
                    .email(String.format("citizen%02d@example.com", i))
                    .phone("+84900000" + String.format("%03d", i))
                    .passwordHash(passwordEncoder.encode("Password!" + i))
                    .role(roleCacheService.get(RoleEnum.CITIZEN))
                    .status("ACTIVE")
                    .build());
        }

        /* ============================
           ENTERPRISE ACCOUNTS (2)
        ============================ */
        users.add(User.builder()
                .fullName("Green Earth Enterprise")
                .email("enterprise1@suwmp.com")
                .phone("+84911111111")
                .passwordHash(passwordEncoder.encode("Enterprise@123"))
                .role(roleCacheService.get(RoleEnum.ENTERPRISE))
                .status("ACTIVE")
                .build());

        users.add(User.builder()
                .fullName("Urban Cleaners Enterprise")
                .email("enterprise2@suwmp.com")
                .phone("+84922222222")
                .passwordHash(passwordEncoder.encode("Enterprise@123"))
                .role(roleCacheService.get(RoleEnum.ENTERPRISE))
                .status("ACTIVE")
                .build());

        /* ============================
           COLLECTORS (2)
        ============================ */
        users.add(User.builder()
                .fullName("Collector Nguyen Van A")
                .email("collector1@suwmp.com")
                .phone("+84933333333")
                .passwordHash(passwordEncoder.encode("Collector@123"))
                .role(roleCacheService.get(RoleEnum.COLLECTOR))
                .status("ACTIVE")
                .build());

        users.add(User.builder()
                .fullName("Collector Tran Van B")
                .email("collector2@suwmp.com")
                .phone("+84944444444")
                .passwordHash(passwordEncoder.encode("Collector@123"))
                .role(roleCacheService.get(RoleEnum.COLLECTOR))
                .status("ACTIVE")
                .build());

        /* ============================
           ADMINS (2)
        ============================ */
        users.add(User.builder()
                .fullName("System Admin One")
                .email("admin1@suwmp.com")
                .phone("+84988888881")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(roleCacheService.get(RoleEnum.ADMIN))
                .status("ACTIVE")
                .build());

        users.add(User.builder()
                .fullName("System Admin Two")
                .email("admin2@suwmp.com")
                .phone("+84988888882")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(roleCacheService.get(RoleEnum.ADMIN))
                .status("ACTIVE")
                .build());

        userRepository.saveAll(users);

        System.out.println("✅ Seed completed:");
        System.out.println("   - 10 CITIZENS");
        System.out.println("   - 2 ENTERPRISES");
        System.out.println("   - 2 COLLECTORS");
        System.out.println("   - 2 ADMINS");
    }
}
