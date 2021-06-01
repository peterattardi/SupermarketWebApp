package com.ingsoft2021.SupermarketApp.appadmin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppAdminRepository extends JpaRepository<AppAdmin, String> {

    Optional<AppAdmin> findByEmail(String email);


}
