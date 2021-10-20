package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.util.AppUserRole;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@EqualsAndHashCode
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "admin")
public class AppAdmin{

    @Id
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private AppUserRole appUserRole;
    private String supermarketName;

    public AppAdmin(String email, String password,String supermarketName) {
        this.email = email;
        this.password = password;
        this.appUserRole = appUserRole;
        this.supermarketName = supermarketName;
    }








}
