package com.ingsoft2021.SupermarketApp.security;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminService;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import com.ingsoft2021.SupermarketApp.supermarkets.SupermarketService;
import lombok.AllArgsConstructor;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@AllArgsConstructor
public class Config extends WebSecurityConfigurerAdapter {

    private final AppAdminService appAdminService;
    private final SupermarketService supermarketService;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/**").permitAll()
                .anyRequest().permitAll();

        appAdminService.signUpAdmin(new AppAdmin("admin@conad.it", "conad", AppUserRole.ADMIN, 1000L));
        appAdminService.signUpAdmin(new AppAdmin("admin@deco.it", "deco", AppUserRole.ADMIN, 2000L));
        appAdminService.signUpAdmin(new AppAdmin("admin@coop.it", "copp", AppUserRole.ADMIN, 3000L));

        supermarketService.addNewSupermarket( new Supermarket("Conad", 1000L));
        supermarketService.addNewSupermarket( new Supermarket("Deco", 2000L));
        supermarketService.addNewSupermarket( new Supermarket("Coop", 3000L));
    }


}
