package com.ingsoft2021.SupermarketApp.registration;

import lombok.EqualsAndHashCode;

@EqualsAndHashCode
public class RegistrationRequest {

    private final String firstName;
    private final String lastName;
    private final String password;
    private final String email;
    private final String address;
    private final String cap;
    private final String city;


    public String getCap() {
        return cap;
    }

    public String getCity() {
        return city;
    }

    public String getAddress() {
        return address;
    }

    public RegistrationRequest(String firstName, String lastName, String password, String email, String address, String address1, String cap, String city) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.email = email;
        this.address = address;
        this.cap = cap;
        this.city = city;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String toString() {
        return "RegistrationRequest{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
