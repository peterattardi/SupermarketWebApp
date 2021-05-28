package com.ingsoft2021.SupermarketApp.security.config;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminRepository;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminService;
import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import com.ingsoft2021.SupermarketApp.appuser.AppUserService;
import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import com.ingsoft2021.SupermarketApp.supermarkets.SupermarketService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final SecurityService securityService;
    private final AppAdminService appAdminService;
    private  final AppUserRepository appUserRepository;
    private final SupermarketService supermarketService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/supermarkets").permitAll()
                .antMatchers("/registration/**").permitAll()
                .antMatchers("/admin/**").hasAuthority(AppUserRole.ADMIN.name())
                .anyRequest().permitAll()
                .and().formLogin()
                .and().httpBasic();

        appAdminService.signUpAdmin(new AppAdmin("admin@conad.it", "conad", AppUserRole.ADMIN, 1000L));
        appAdminService.signUpAdmin(new AppAdmin("admin@deco.it", "deco", AppUserRole.ADMIN, 2000L));
        appAdminService.signUpAdmin(new AppAdmin("admin@coop.it", "copp", AppUserRole.ADMIN, 3000L));

        supermarketService.addNewSupermarket( new Supermarket("Conad", 1000L));
        supermarketService.addNewSupermarket( new Supermarket("Deco", 2000L));
        supermarketService.addNewSupermarket( new Supermarket("Coop", 3000L));

        appUserRepository.save(new AppUser("", "", "lol", "lol", AppUserRole.ADMIN, "", "", ""));

    }



    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder);
        provider.setUserDetailsService(securityService);
        return provider;
    }


}
