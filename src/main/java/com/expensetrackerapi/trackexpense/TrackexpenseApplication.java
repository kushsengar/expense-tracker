package com.expensetrackerapi.trackexpense;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class TrackexpenseApplication {

	public static void main(String[] args) {
		SpringApplication.run(TrackexpenseApplication.class, args);
	}

}
