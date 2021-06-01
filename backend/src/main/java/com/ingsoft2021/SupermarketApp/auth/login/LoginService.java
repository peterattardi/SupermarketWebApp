package com.ingsoft2021.SupermarketApp.auth.login;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    public AuthResponse login(LoginRequest loginRequest) throws NoSuchFieldException {
        AuthResponse response = new AuthResponse(null, null, null);
        checkLoginRequest(loginRequest);
        switch (loginRequest.getAppUserRole()){
            case "ADMIN":
                Optional<AppAdmin> appAdmin = appAdminRepository.findByEmail(loginRequest.getEmail());
                if(!appAdmin.isPresent()) throw new IllegalStateException("EMAIL_NOT_FOUND");
                if(bCryptPasswordEncoder.matches(loginRequest.getPassword(), appAdmin.get().getPassword())) {
                    String token = UUID.randomUUID().toString();
                    String cryptedToken = bCryptPasswordEncoder.encode(token);
                    LocalDateTime createdAt = LocalDateTime.now();
                    LocalDateTime expiresAt = LocalDateTime.now().plusHours(2);
                    loginRepository.save(new Login(appAdmin.get().getEmail(), ADMIN, cryptedToken, createdAt, expiresAt));
                    response = new AuthResponse(token, appAdmin.get().getEmail(), expiresAt);
                }else throw new IllegalStateException("INVALID_PASSWORD");
                break;
            case "USER":
                Optional<AppUser> appUser = appUserRepository.findByEmail(loginRequest.getEmail());
                if(!appUser.isPresent()) throw new IllegalStateException("EMAIL_NOT_FOUND");
                if(bCryptPasswordEncoder.matches(loginRequest.getPassword(), appUser.get().getPassword())) {
                    String token = UUID.randomUUID().toString();
                    String cryptedToken = bCryptPasswordEncoder.encode(token);
                    LocalDateTime createdAt = LocalDateTime.now();
                    LocalDateTime expiresAt = LocalDateTime.now().plusHours(2);
                    loginRepository.save(new Login(appUser.get().getEmail(), USER, cryptedToken, createdAt, expiresAt));
                    response = new AuthResponse(token, appUser.get().getEmail(), expiresAt);
                }else throw new IllegalStateException("INVALID_PASSWORD");
                break;
            default:
                throw new IllegalStateException("Wrong username or/and password");
        }
        return response;
    }

    private void checkLoginRequest(LoginRequest l) throws NoSuchFieldException {
        if(l.getEmail() == null || l.getEmail().isEmpty()) throw new NoSuchFieldException("EMAIL_NULL_OR_EMPTY");
        if(l.getPassword() == null || l.getPassword().isEmpty()) throw new NoSuchFieldException("PASSWORD_NULL_OR_EMPTY");
        if(l.getAppUserRole() == null || l.getAppUserRole().isEmpty()) throw new NoSuchFieldException("APPUSERROLE_NULL_OR_EMPTY");
        if(l.getAppUserRole() != "USER" && l.getAppUserRole() != "ADMIN") throw new IllegalStateException("APPUSERROLE_NOT_VALID");

    }

    public void logout(String token) {
        Login existingUser = findAdminByToken(token);
        loginRepository.delete(loginRepository.findByEmail(existingUser.getEmail()).get());
    }


    public Login findAdminByToken(String token) throws IllegalStateException{
        List<Login> logins = loginRepository.findAll();
        for(Login login : logins){
            if(bCryptPasswordEncoder.matches(token, login.getToken())){
                return login;
            }
        }
        throw new IllegalStateException("TOKEN_NOT_FOUND");
    }

}
