package com.ingsoft2021.SupermarketApp.appuser;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@Entity
@Table(name = "user")
public class AppUser{


    private String firstName;
    private String LastName;
    @Id
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private AppUserRole appUserRole;
    private boolean locked = false;
    private boolean enabled = false;
    private String address;
    private String cap;
    private String city;



    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return LastName;
    }




    public AppUser(String firstName, String lastName, String email, String password, String address, String cap, String city) {
        this.firstName = firstName;
        LastName = lastName;
        this.email = email;
        this.password = password;
        this.address = address;
        this.cap = cap;
        this.city = city;
    }

}
