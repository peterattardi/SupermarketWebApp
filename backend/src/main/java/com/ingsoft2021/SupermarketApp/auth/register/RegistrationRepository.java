package com.ingsoft2021.SupermarketApp.auth.register;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, String> {

    Optional<Registration> findByToken(String token);

}
