package com.ingsoft2021.SupermarketApp.auth.register;


import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import com.ingsoft2021.SupermarketApp.appuser.AppUserService;
import com.ingsoft2021.SupermarketApp.email.EmailValidator;
import com.ingsoft2021.SupermarketApp.email.EmailSender;

import com.ingsoft2021.SupermarketApp.auth.login.AuthResponse;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RegistrationService {
    private final AppUserService appUserService;
    private final EmailValidator emailValidator;
    private final EmailSender emailSender;
    private final RegistrationRepository registrationRepository;

    public AuthResponse register(AppUser appUser) throws NoSuchFieldException {
        checkRequestField(appUser);
        boolean isValid = emailValidator.test(appUser.getEmail());
        if (!isValid) throw new IllegalStateException("WRONG_EMAIL_FORMAT");
        appUser.setAppUserRole(AppUserRole.USER);
        appUserService.signUpUser(appUser);
        String token = UUID.randomUUID().toString();
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(15);
        Registration registration = new Registration(appUser.getEmail(), token, createdAt,expiresAt);
        registrationRepository.save(registration);
        AuthResponse authResponse = new AuthResponse(token, appUser.getEmail(), expiresAt);

        String link = "http://localhost:8080/registration/confirm?token=" + token;
        emailSender.send(appUser.getEmail(), buildEmail(appUser.getFirstName(), link));

        return authResponse;
    }

    private void checkRequestField(AppUser r) throws NoSuchFieldException {
        if(r.getEmail() == null || r.getEmail().isEmpty()) throw new NoSuchFieldException("EMAIL_NULL_OR_EMPTY");
        if(r.getAddress() == null || r.getAddress().isEmpty()) throw new NoSuchFieldException("ADDRESS_NULL_OR_EMPTY");
        if(r.getCap() == null || r.getCap().isEmpty()) throw new NoSuchFieldException("CAP_NULL_OR_EMPTY");
        if(r.getCity() == null || r.getCity().isEmpty()) throw new NoSuchFieldException("CITY_NULL_OR_EMPTY");
        if(r.getPassword() == null || r.getPassword().isEmpty()) throw new NoSuchFieldException("PASSWORD_NULL_OR_EMPTY");
        if(r.getFirstName() == null || r.getFirstName().isEmpty()) throw new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if(r.getLastName() == null || r.getLastName().isEmpty()) throw new NoSuchFieldException("SURNAME_NULL_OR_EMPTY");
        if(r.getPassword().length()<6) throw new IllegalStateException("INVALID_PASSWORD");
    }

    public void enableAppUser(String email) {
        appUserService.enableAppUser(email);
    }

    public Optional<Registration> findByToken(String token){
        return registrationRepository.findByToken(token);
    }

    @Transactional
    public boolean confirmToken(String token) {
        Registration registration = findByToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("TOKEN_NOT_FOUND"));

        if (registration.getConfirmedAt() != null) {
            throw new IllegalStateException("TOKEN_ALREADY_CONFIRMED");
        }

        LocalDateTime expiredAt = registration.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("TOKEN_EXPIRED");
        }

        registration.setConfirmedAt(LocalDateTime.now());
        enableAppUser(registration.getEmail());
        return true;
    }

    public String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }


}
