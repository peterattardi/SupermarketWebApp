package com.ingsoft2021.SupermarketApp.security.login;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static com.ingsoft2021.SupermarketApp.appuser.AppUserRole.*;

@AllArgsConstructor
@Service
public class LoginService {

    private final LoginRepository loginRepository;
    private final AppUserRepository appUserRepository;
    private final AppAdminRepository appAdminRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public String login(LoginRequest loginRequest) {
        String token = "invalid-token-not-expected";
        switch (loginRequest.getAppUserRole()){
            case "ADMIN":
                Optional<AppAdmin> appAdmin = appAdminRepository.findByEmail(loginRequest.getEmail());
                if(!appAdmin.isPresent()) throw new IllegalArgumentException("Wrong username or/and password");
                if(bCryptPasswordEncoder.matches(loginRequest.getPassword(), appAdmin.get().getPassword())) {
                    token = UUID.randomUUID().toString();
                    LocalDateTime createdAt = LocalDateTime.now();
                    LocalDateTime expiresAt = LocalDateTime.now().plusHours(2);
                    loginRepository.save(new Login(appAdmin.get().getEmail(), ADMIN, token, createdAt, expiresAt));
                }else throw new IllegalArgumentException("Wrong username or/and password");
                break;
            case "USER":
                Optional<AppUser> appUser = appUserRepository.findByEmail(loginRequest.getEmail());
                if(!appUser.isPresent()) throw new IllegalArgumentException("Wrong username or/and password");
                if(bCryptPasswordEncoder.matches(loginRequest.getPassword(), appUser.get().getPassword())) {
                    token = UUID.randomUUID().toString();
                    LocalDateTime createdAt = LocalDateTime.now();
                    LocalDateTime expiresAt = LocalDateTime.now().plusHours(2);
                    loginRepository.save(new Login(appUser.get().getEmail(), USER, token, createdAt, expiresAt));
                }else throw new IllegalArgumentException("Wrong username or/and password");
                break;
            default:
                throw new IllegalArgumentException("Wrong username or/and password");
        }
        return token;
    }

    public void logout(String token) {
        Optional<Login> existingToken = loginRepository.findByToken(token);
        if(!existingToken.isPresent()) throw new IllegalArgumentException("Token not referring to any user");
        loginRepository.delete(existingToken.get());
    }
}
