package com.expensetrackerapi.trackexpense.service;

import com.expensetrackerapi.trackexpense.dto.LoginRequest;
import com.expensetrackerapi.trackexpense.dto.RegisterRequest;
import com.expensetrackerapi.trackexpense.entity.User;
import com.expensetrackerapi.trackexpense.respository.UserRepository;
import com.expensetrackerapi.trackexpense.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    public boolean register(RegisterRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        try {
            User user = new User();
            user.setRole(User.Role.USER);
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            userRepository.save(user);
            return true;
        }catch (Exception e){
            return false;
        }
    }
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtService.generateToken(user.getEmail(), String.valueOf(user.getRole()));
    }

}
