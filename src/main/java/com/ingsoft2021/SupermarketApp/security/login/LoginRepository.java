package com.ingsoft2021.SupermarketApp.security.login;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginRepository extends JpaRepository<Login, String> {

}
