package com.ingsoft2021.SupermarketApp.auth.login;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class LoginRepositoryTest {

    @Autowired
    private LoginRepository loginRepository;


    @Test
    void shouldReturnTrueWhenFindingAnExistingLoggedUser() {
        loginRepository.save(new Login("email@email.com", AppUserRole.USER, "abc", LocalDateTime.now(), LocalDateTime.now()));

        assertTrue(loginRepository.findByToken("abc").isPresent());

    }

    @Test
    void shouldReturnFalseWhenFindingAnNonExistingLoggedUser() {
        assertFalse(loginRepository.findByToken("cba").isPresent());
    }
}