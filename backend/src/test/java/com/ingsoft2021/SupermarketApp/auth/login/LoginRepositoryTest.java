package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class LoginRepositoryTest {

    @Autowired
    LoginRepository loginRepository;

    Login login = new Login("email@email.it", AppUserRole.ADMIN,"token",null,null);


}