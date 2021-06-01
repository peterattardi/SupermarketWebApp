package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock LoginRepository loginRepository;
    @Mock AppAdminRepository appAdminRepository;
    @Mock AppUserRepository appUserRepository;
    @InjectMocks LoginService underTest;
    @Mock BCryptPasswordEncoder bCryptPasswordEncoder;


    AppAdmin admin;
    AppUser user;
    LoginRequest loginRequestAdmin;
    LoginRequest loginRequestUser;



    @BeforeEach
    void setUp() {
        admin = new AppAdmin("admin@admin.it","pass","conad");
        user = new AppUser("name","surname","admin@conad.it","pass-pass","address","90","city");
        loginRequestAdmin = new LoginRequest(admin.getEmail(), admin.getPassword(), "ADMIN");
        loginRequestUser = new LoginRequest(user.getEmail(), user.getPassword(), "USER");

    }

    @Test
    void shouldLoginAnExistingAdminCorrectly() {
        when(appAdminRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(bCryptPasswordEncoder.matches(admin.getPassword(),admin.getPassword())).thenReturn(true);
        assertDoesNotThrow(()->{ underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldLoginAnExistingUserCorrectly() {
        when(appUserRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(bCryptPasswordEncoder.matches(user.getPassword(),user.getPassword())).thenReturn(true);
        assertDoesNotThrow(()->{ underTest.login(loginRequestUser);});
    }


    @Test
    void shouldThrowExceptionWhenLogginWithNULLEmail(){
        loginRequestAdmin.setEmail(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowExceptionWhenLogginWithEmptyEmail(){
        loginRequestAdmin.setEmail("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowExceptionWhenLogginWithNULLPassword(){
        loginRequestAdmin.setPassword(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowExceptionWhenLogginWithEmptyPassword(){
        loginRequestAdmin.setPassword("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowExceptionWhenLogginWithNULLAppUserRole(){
        loginRequestAdmin.setAppUserRole(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowExceptionWhenLogginWithEmptyAppUserRole(){
        loginRequestAdmin.setAppUserRole("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowExceptionWhenLoggingANonExistingUser(){
        when(appUserRepository.findByEmail(user.getEmail())).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, ()->{underTest.login(loginRequestUser);});
    }

    @Test
    void shouldThrowExceptionWhenLoggingANonExistingAdmin(){
        when(appAdminRepository.findByEmail(admin.getEmail())).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, ()->{underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowExceptionWhenEnteringInvalidPassword(){
        loginRequestAdmin.setPassword("small");
        assertThrows(IllegalStateException.class, () -> {underTest.login(loginRequestAdmin);});
    }

    @Test
    void shouldThrowIllegalStateExceptionWhenLogginAnAdminAsAUser(){
        LoginRequest fake = new LoginRequest(user.getEmail(), user.getPassword(), "ADMIN");
        when(appAdminRepository.findByEmail(user.getEmail())).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, () -> {underTest.login(fake);});
    }

    @Test
    void shouldThrowIllegalStateExceptionWhenAppUserRoleNotValid(){
        LoginRequest fake = new LoginRequest(user.getEmail(), user.getPassword(), "BOH");
        assertThrows(IllegalStateException.class, () -> {underTest.login(fake);});
    }







}