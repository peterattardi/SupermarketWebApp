package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class AppAdminRepositoryTest {

    @Autowired
    private AppAdminRepository appAdminRepository;


    @Test
    void findByEmailTest() {
        AppAdmin admin = new AppAdmin("admin@admin.it", "lol", AppUserRole.ADMIN, 200L);
        appAdminRepository.save(admin);

        assertTrue(appAdminRepository.findByEmail(admin.getEmail()).isPresent());

    }
}