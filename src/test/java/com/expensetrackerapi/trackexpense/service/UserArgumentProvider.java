package com.expensetrackerapi.trackexpense.service;

import com.expensetrackerapi.trackexpense.dto.RegisterRequest;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;

import java.util.stream.Stream;

public class UserArgumentProvider implements ArgumentsProvider {

    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {

        return Stream.of(
                Arguments.of(
                        new RegisterRequest("kush@gmail.com", "password123")
                ),
                Arguments.of(
                        new RegisterRequest("test@gmail.com", "")
                ),
                Arguments.of(
                        new RegisterRequest("invalid-email", "password123")
                )
        );
    }
}