package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRepository;
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

    public AuthResponse login(LoginRequest loginRequest) {
        AuthResponse response = new AuthResponse(null, null, null);
        switch (loginRequest.getAppUserRole()){
            case "ADMIN":
                Optional<AppAdmin> appAdmin = appAdminRepository.findByEmail(loginRequest.getEmail());
                if(!appAdmin.isPresent()) throw new IllegalArgumentException("EMAIL_NOT_FOUND");
                if(bCryptPasswordEncoder.matches(loginRequest.getPassword(), appAdmin.get().getPassword())) {
                    String token = UUID.randomUUID().toString();
                    LocalDateTime createdAt = LocalDateTime.now();
                    LocalDateTime expiresAt = LocalDateTime.now().plusHours(2);
                    loginRepository.save(new Login(appAdmin.get().getEmail(), ADMIN, token, createdAt, expiresAt));
                    response = new AuthResponse(token, appAdmin.get().getEmail(), expiresAt);
                }else throw new IllegalArgumentException("INVALID_PASSWORD");
                break;
            case "USER":
                Optional<AppUser> appUser = appUserRepository.findByEmail(loginRequest.getEmail());
                if(!appUser.isPresent()) throw new IllegalArgumentException("EMAIL_NOT_FOUND");
                if(bCryptPasswordEncoder.matches(loginRequest.getPassword(), appUser.get().getPassword())) {
                    String token = UUID.randomUUID().toString();
                    LocalDateTime createdAt = LocalDateTime.now();
                    LocalDateTime expiresAt = LocalDateTime.now().plusHours(2);
                    loginRepository.save(new Login(appUser.get().getEmail(), USER, token, createdAt, expiresAt));
                    response = new AuthResponse(token, appUser.get().getEmail(), expiresAt);
                }else throw new IllegalArgumentException("INVALID_PASSWORD");
                break;
            default:
                throw new IllegalArgumentException("Wrong username or/and password");
        }
        return response;
    }

    public void logout(String token) {
        Optional<Login> existingToken = loginRepository.findByToken(token);
        if(!existingToken.isPresent()) throw new IllegalArgumentException("Token not referring to any user");
        loginRepository.delete(existingToken.get());
    }

    public Optional<Login> findByToken(String token){
        return loginRepository.findByToken(token);
    }
}
