package com.ingsoft2021.SupermarketApp.appuser;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;


@Service
@AllArgsConstructor
public class AppUserService{


    private final AppUserRepository appUserRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public Optional<AppUser> findByEmail(String email){
        return appUserRepository.findByEmail(email);
    }

    public void signUpUser(AppUser appUser) {
        boolean userExists = appUserRepository.findByEmail(appUser.getEmail()).isPresent();
        if (userExists) throw new IllegalStateException("EMAIL_EXISTS");
        String encodedPassword = bCryptPasswordEncoder.encode(appUser.getPassword());
        appUser.setPassword(encodedPassword);
        appUserRepository.save(appUser);
        //TODO: remove appUserRole from RequestBody of User
    }

    public void enableAppUser(String email){
        appUserRepository.enableAppUser(email);
    }




}
