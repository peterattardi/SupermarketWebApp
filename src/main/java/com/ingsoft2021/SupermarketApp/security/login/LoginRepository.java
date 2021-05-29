package com.ingsoft2021.SupermarketApp.security.login;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginRepository extends JpaRepository<Login, String> {
    Optional<Login> findByToken(String token);
}
