package com.ingsoft2021.SupermarketApp.appadmin;


import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import com.ingsoft2021.SupermarketApp.catalogue.Product;
import com.ingsoft2021.SupermarketApp.catalogue.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.catalogue.ProductRequest;
import com.ingsoft2021.SupermarketApp.catalogue.ProductService;

import com.ingsoft2021.SupermarketApp.auth.login.Login;
import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import lombok.AllArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


@AllArgsConstructor
@Service
public class AppAdminService {

    private final AppAdminRepository appAdminRepository;
    private final ProductService productService;
    private final LoginService loginService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;



    public void signUpAdmin(AppAdmin appAdmin) {
        boolean userExists = appAdminRepository.findByEmail(appAdmin.getUsername()).isPresent();
        if (userExists) throw new IllegalArgumentException("Admin already present");
        String encodedPassword = bCryptPasswordEncoder.encode(appAdmin.getPassword());
        appAdmin.setPassword(encodedPassword);
        appAdminRepository.save(appAdmin);
    }


    public List<Product> findAllProducts(String token){
        AppAdmin appAdmin = findAdminFromToken(token);
        return productService.findAllBySupermarketId(appAdmin.getSupermarketId());
    }


    public void addProduct(ProductRequest product, String token) throws IllegalArgumentException {
        AppAdmin admin = findAdminFromToken(token);
        product.setSupermarketId(admin.getSupermarketId());
        productService.addProduct(product);
    }

    public void deleteProduct(String token, ProductDeleteRequest request) throws  IllegalArgumentException, NoSuchElementException {
        AppAdmin admin = findAdminFromToken(token);
        System.out.println("token="+token + "name" + request.getProductName() +", brand ="+request.getProductBrand());
        productService.deleteProduct(request, admin.getSupermarketId());
    }



    public AppAdmin findAdminFromToken(String token){
        //Is the request coming from a logged admin? And if yes, I need to store the admin supermarket id
        Optional<Login> adminToken = loginService.findByToken(token);
        if(adminToken.isEmpty()) throw new IllegalArgumentException("User not logged or not valid");
        //Now we know that the token is valid and it comes from a logged user. Let's find out his privileges
        boolean isAdmin = adminToken.get().getAppUserRole() == AppUserRole.ADMIN;
        if(!isAdmin) throw new IllegalArgumentException("Not authorized");
        /* Okay, now we can proceed */
        String email = adminToken.get().getEmail();
        //noinspection OptionalGetWithoutIsPresent
        return appAdminRepository.findByEmail(email).get();

    }



}

