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

        appAdminService.signUpAdmin(new AppAdmin("admin@conad.it", "conad-conad", AppUserRole.ADMIN, "conad"));
        appAdminService.signUpAdmin(new AppAdmin("admin@deco.it", "deco-deco", AppUserRole.ADMIN, "deco"));
        appAdminService.signUpAdmin(new AppAdmin("admin@coop.it", "coop-coop", AppUserRole.ADMIN, "coop"));
        appAdminService.signUpAdmin(new AppAdmin("admin@despar.it", "despar-despar", AppUserRole.ADMIN, "despar"));


        supermarketService.addNewSupermarket( new Supermarket("Conad"));
        supermarketService.addNewSupermarket( new Supermarket("Deco"));
        supermarketService.addNewSupermarket( new Supermarket("Coop"));
        supermarketService.addNewSupermarket( new Supermarket("despar"));
    }


}
