package com.ingsoft2021.SupermarketApp.appadmin;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class AppAdminRepositoryTest {

    @Autowired
    AppAdminRepository appAdminRepository;

    AppAdmin admin = new AppAdmin("email@email.it","pass", "conad");


    @Test
    void shouldReturnAnAdminWhenPassingACorrectEmail() {
        appAdminRepository.save(admin);
        Optional<AppAdmin> result = appAdminRepository.findByEmail("email@email.it");
        assertEquals(result.get().getEmail(), admin.getEmail());
    }

    @Test
    void shouldReturnEmptySetWhenPassingIncorrectEmail(){
        appAdminRepository.save(admin);
        Optional<AppAdmin> result = appAdminRepository.findByEmail("not@valid.it");
        assertTrue(result.isEmpty());
    }
}