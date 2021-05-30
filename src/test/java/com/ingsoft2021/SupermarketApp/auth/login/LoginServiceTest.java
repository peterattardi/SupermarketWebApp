package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;


@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock
    private LoginRepository loginRepository;
    @Mock
    private AppAdminRepository appAdminRepository;

    @InjectMocks
    private LoginService loginService;

    @Test
    void canLogin() {
        LoginRequest loginRequest = new LoginRequest("admin@conad.it","conad","ADMIN");
        assertNotNull(loginService.login(loginRequest));
    }


    @Test
    void shouldThrowExceptionWhenLoggingANonRegisteredUser() {
        LoginRequest loginRequest = new LoginRequest("not@admin.it","pass","ADMIN");
        assertThrows(IllegalArgumentException.class, () -> {loginService.login(loginRequest);});
    }

    @Test
    void logout() {

    }

    @Test
    void findByToken() {
    }
}