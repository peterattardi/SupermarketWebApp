package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class LoginRepositoryTest {

    @Autowired
    LoginRepository loginRepository;

    Login login = new Login("email@email.it", AppUserRole.ADMIN,"token",null,null);

    @Test
    void shouldReturnLoggedUserWhenProvidingExistingToken() {
        loginRepository.save(login);
        assertEquals(loginRepository.findByToken("token").get().getToken(), login.getToken());
    }

    @Test
    void shouldReturnEmptySetWhenProvidingNonExistingToken() {
        assertTrue(loginRepository.findByToken("non-existing").isEmpty());
    }
}