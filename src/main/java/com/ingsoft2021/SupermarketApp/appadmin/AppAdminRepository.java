package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppAdminRepository extends JpaRepository<AppAdmin, Long> {

    Optional<AppAdmin> findByEmail(String email);

}