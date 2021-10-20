package com.ingsoft2021.SupermarketApp.appadmin;


import com.ingsoft2021.SupermarketApp.util.AppUserRole;
import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.product.ProductService;

import com.ingsoft2021.SupermarketApp.auth.login.Login;
import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import com.ingsoft2021.SupermarketApp.shop.ShopService;
import com.ingsoft2021.SupermarketApp.util.request.UpdateProductRequest;
import lombok.AllArgsConstructor;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;


@AllArgsConstructor
@Service
public class AppAdminService {

    private final AppAdminRepository appAdminRepository;
    private final ProductService productService;
    private final LoginService loginService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ShopService shopService;


    public void signUpAdmin(AppAdmin appAdmin) {
        boolean userExists = appAdminRepository.findByEmail(appAdmin.getEmail()).isPresent();
        if (userExists) throw new IllegalStateException("Admin already present");
        String encodedPassword = bCryptPasswordEncoder.encode(appAdmin.getPassword());
        appAdmin.setPassword(encodedPassword);
        appAdmin.setAppUserRole(AppUserRole.ADMIN);
        appAdminRepository.save(appAdmin);
    }


    public List<Product> findAllProducts(String token){
        AppAdmin appAdmin = findAdminByToken(token);
        return productService.findAllBySupermarketName(appAdmin.getSupermarketName());
    }


    public void addProduct(Product product, String token) throws IllegalStateException, NoSuchFieldException {
        AppAdmin admin = findAdminByToken(token);
        product.setSupermarketName(admin.getSupermarketName());
        productService.addProduct(product);
        shopService.addInEveryShop(product, admin.getSupermarketName());
    }

    public void deleteProduct(String token, ProductDeleteRequest request) throws IllegalStateException, NoSuchElementException, NoSuchFieldException {
        AppAdmin admin = findAdminByToken(token);
        productService.deleteProduct(request, admin.getSupermarketName());
        shopService.deleteInEveryShop(request, admin.getSupermarketName());
    }



    public AppAdmin findAdminByToken(String token){
        //Is the request coming from a logged admin? And if yes, I need to store the admin supermarket id
        Login adminToken = loginService.findByToken(token);
        //Now we know that the token is valid and it comes from a logged user. Let's find out his privileges
        boolean isAdmin = adminToken.getAppUserRole() == AppUserRole.ADMIN;
        if(!isAdmin) throw new IllegalStateException("UNAUTHORIZED");
        //Finally, is the token expired?
        if(adminToken.getExpiresAt().isBefore(LocalDateTime.now())){
            throw new IllegalStateException("TOKEN_EXPIRED");
        }
        /* Okay, now we can proceed */
        String email = adminToken.getEmail();
        //noinspection OptionalGetWithoutIsPresent
        return appAdminRepository.findByEmail(email).get();

    }


    public void updateProduct(UpdateProductRequest product, String token) throws NoSuchFieldException {
        AppAdmin admin = findAdminByToken(token);
        product.setSupermarketName(admin.getSupermarketName());
        productService.updateProduct(product);
        shopService.updateInEveryShop(product, admin.getSupermarketName());
    }
}

