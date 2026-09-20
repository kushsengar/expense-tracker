package com.expensetrackerapi.trackexpense.security;

import com.expensetrackerapi.trackexpense.entity.User;
import com.expensetrackerapi.trackexpense.respository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        boolean adminExists = userRepository.existsByRole(User.Role.ADMIN);

        if (!adminExists) {
            User admin = new User();
            admin.setEmail("admin@yourapp.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);

            userRepository.save(admin);

            System.out.println("🔥 Default admin created");
        }
    }
}