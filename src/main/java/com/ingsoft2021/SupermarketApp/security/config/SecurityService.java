package com.ingsoft2021.SupermarketApp.security.config;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class SecurityService implements UserDetailsService {

    private final AppAdminRepository appAdminRepository;
    private final AppUserRepository appUserRepository;

    @Override
    public UserDetails loadUserByUsername(String mail) throws UsernameNotFoundException {

        Optional<AppAdmin> admin = appAdminRepository.findByEmail(mail);
        if  (admin.isPresent()) {

            return appAdminRepository.findByEmail(mail)
                    .orElseThrow(() -> new UsernameNotFoundException(String.format("User with email %s not found.", mail)));
        }else{
            return appUserRepository.findByEmail(mail)
                    .orElseThrow(() -> new UsernameNotFoundException(String.format("User with email %s not found.", mail)));
        }
    }
}
