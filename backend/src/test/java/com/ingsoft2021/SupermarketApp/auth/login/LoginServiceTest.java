package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {

    @Mock AppAdminRepository appAdminRepository;

    @InjectMocks
    LoginService loginService;

    @Mock LoginService loginRepository;

    @Mock
    BCryptPasswordEncoder bCryptPasswordEncoder;

    AppAdmin user = new AppAdmin("email@email.it","pass", "conad");





}