package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRepository;
import com.ingsoft2021.SupermarketApp.registration.token.ConfirmationToken;
import com.ingsoft2021.SupermarketApp.registration.token.ConfirmationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@Service
public class AppAdminService {

    private AppAdminRepository appAdminRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;



    public void signUpAdmin(AppAdmin appAdmin) {
        boolean userExists = appAdminRepository.findByEmail(appAdmin.getUsername()).isPresent();
        if (userExists) throw new IllegalArgumentException("Admin already present");
        String encodedPassword = bCryptPasswordEncoder.encode(appAdmin.getPassword());
        appAdmin.setPassword(encodedPassword);
        appAdminRepository.save(appAdmin);
    }



}
