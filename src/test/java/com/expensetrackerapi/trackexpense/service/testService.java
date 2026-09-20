package com.expensetrackerapi.trackexpense.service;

import com.expensetrackerapi.trackexpense.dto.RegisterRequest;
import com.expensetrackerapi.trackexpense.entity.User;
import com.expensetrackerapi.trackexpense.respository.UserRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class testService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

//
//@ParameterizedTest@Disabled
//    @CsvSource({
//            "ksatips11@gmail.com",
//            "ks1atips11@gmail.com",
//            "kusatips11@gmail.com"
//    })
//    public void test(String email){
//        assertTrue(userRepository.findByEmail(email).isPresent());
//    }

    @ParameterizedTest
    @ArgumentsSource(UserArgumentProvider.class)
    public void testSaveUser(RegisterRequest  registerRequest){
        assertTrue(authService.register(registerRequest));
    }
    @ParameterizedTest
    @ArgumentsSource(UserArgumentProvider.class)
    void testRegister(RegisterRequest request) {
        boolean result = authService.register(request);

        // Example logic — adjust based on your implementation
        if (request.getEmail().contains("@") && !request.getPassword().isEmpty()) {
            assertTrue(result);
        } else {
            assertFalse(result);
        }
    }
}
