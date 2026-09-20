package com.expensetrackerapi.trackexpense.respository;

import com.expensetrackerapi.trackexpense.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByRole(User.Role role);
}
