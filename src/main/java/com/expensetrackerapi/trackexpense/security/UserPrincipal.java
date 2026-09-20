package com.expensetrackerapi.trackexpense.security;

import com.expensetrackerapi.trackexpense.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails
{
    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
        System.out.println("Loaded user email = " + user.getEmail());
        System.out.println("Loaded user role = " + user.getRole());
    }

    // 🔥 THIS METHOD GOES HERE
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println("Authorities = " +
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );
    }

    @Override
    public String getPassword() {
        return "";
    }

//    @Override
//    public String getPassword() {
//        return user.getPassword();
//    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
