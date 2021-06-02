package com.ingsoft2021.SupermarketApp.auth.register;

import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import com.ingsoft2021.SupermarketApp.appuser.AppUserService;
import com.ingsoft2021.SupermarketApp.auth.AuthResponse;
import com.ingsoft2021.SupermarketApp.auth.login.Login;
import com.ingsoft2021.SupermarketApp.auth.login.LoginRepository;
import com.ingsoft2021.SupermarketApp.auth.login.LoginRequest;
import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import com.ingsoft2021.SupermarketApp.email.EmailSender;
import com.ingsoft2021.SupermarketApp.email.EmailValidator;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    AppUser appUser;
    AuthResponse authResponse;
    @InjectMocks RegistrationService underTest;
    @Mock RegistrationRepository registrationRepository;
    @Mock EmailSender emailSender;
    @Mock EmailValidator emailValidator;
    @Mock AppUserService appUserService;
    @Mock LoginService loginService;

    @BeforeEach
    void setUp() {
        appUser = new AppUser("name","surname","admin@conad.it","pass-pass","address","90","city");
        authResponse = new AuthResponse("token", "admin@conad.it", LocalDateTime.now());
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithNULLName() {
        appUser.setFirstName(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithEmptyName() {
        appUser.setFirstName("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithNULLSurname() {
        appUser.setLastName(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithEmptySurname() {
        appUser.setLastName("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithNULLPassword() {
        appUser.setPassword(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithNULLAddress() {
        appUser.setAddress(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithEmptyAddress() {
        appUser.setAddress("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithNULLCAP() {
        appUser.setCap(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithEmptyCAP() {
        appUser.setCap("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithNULLCity() {
        appUser.setCity(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithEmptyCity() {
        appUser.setCity("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }
    @Test
    void shouldThrowExceptionWhenRegisteringUserWithNULLEmail() {
        appUser.setEmail(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringUserWithEmptyEmail() {
        appUser.setEmail("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegisteringAUserWithExistingEmail(){
        when(emailValidator.test(appUser.getEmail())).thenReturn(true);
        when(appUserService.signUpUser(appUser)).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, () -> {underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionIfPasswordHasLessThan6Characters(){
        appUser.setPassword("small");
        assertThrows(IllegalStateException.class, ()->{underTest.register(appUser);});
    }

    @Test
    void shouldThrowExceptionWhenRegistringInvalidEmail(){
        appUser.setEmail("@l");
        assertThrows(IllegalStateException.class, ()->{underTest.register(appUser);});
    }

    @Test
    void shouldConfirmAValidToken(){
        when(registrationRepository.findByToken("token")).thenReturn(Optional.of(new Registration(appUser.getEmail(), "token",LocalDateTime.now(), LocalDateTime.now().plusHours(2))));
        assertDoesNotThrow(()->{underTest.confirmToken("token");});
    }

    @Test
    void shouldThrowExceptionWhenConfirminAnExpiredToken(){
        when(registrationRepository.findByToken("token")).thenReturn(Optional.of(new Registration(
                appUser.getEmail(), "token",null,LocalDateTime.now().minusHours(2))
        ));
        assertThrows(IllegalStateException.class, () -> {underTest.confirmToken("token");});
    }

    @Test
    void shouldThrowExceptionWhenConfirminANonExistingToken(){
        when(registrationRepository.findByToken("token")).thenReturn(Optional.empty());
        assertThrows(IllegalStateException.class, () -> {underTest.confirmToken("token");});
    }

    @Test
    void shouldThrowExceptionWhenConfirminAnAlreadyConfirmedToken(){
        Registration confirmedRegistration = new Registration(
                    appUser.getEmail(), "token",null,LocalDateTime.now().minusHours(2));
        confirmedRegistration.setConfirmedAt(LocalDateTime.now().minusMinutes(23));
        when(registrationRepository.findByToken("token")).thenReturn(Optional.of(confirmedRegistration));
        assertThrows(IllegalStateException.class, () -> {underTest.confirmToken("token");});
    }



}