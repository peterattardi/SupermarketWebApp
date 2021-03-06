package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.util.AppUserRole;
import com.ingsoft2021.SupermarketApp.auth.login.Login;
import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.product.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppAdminServiceTest {

    @Mock AppAdminRepository appAdminRepository;
    @Mock LoginService loginService;
    @Mock ProductService productService;
    @InjectMocks AppAdminService underTest;
    AppAdmin admin;

    Product p1, p2, p3;
    ProductDeleteRequest pdr;

    @BeforeEach
    void setUp() {
        p1 = new Product("one","brand_one","no_desc","no_facts",2L,1,"grams","conad",  null);
        p2 = new Product("two","brand_two","no_desc","no_facts",2L,1,"grams","conad", null);
        p3 = new Product("three","brand_three","no_desc","no_facts",2L,1,"grams","conad", null);
        pdr = new ProductDeleteRequest(p1.getProductName(), p1.getProductBrand());
        admin = new AppAdmin("admin@admin.it","pass","conad");
    }

    @Test
    void shouldReturnListOfProductWhenRequestFromValidAdmin() {
        when(appAdminRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(loginService.findByToken("token")).thenReturn(new Login(
                admin.getEmail(), AppUserRole.ADMIN, "token", LocalDateTime.now(),  LocalDateTime.now().plusHours(2))
        );
        when(productService.findAllBySupermarketName("conad")).thenReturn(Arrays.asList(p1,p2,p3));
        assertEquals(Arrays.asList(p1,p2,p3), underTest.findAllProducts("token"));

    }

    @Test
    void shouldThrowExceptionWhenAddingFromANotAdmin() {
        when(loginService.findByToken("token")).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, () -> {underTest.addProduct(p1, "token");});
    }

    @Test
    void shouldThrowExceptionWhenDeletingFromANotAdmin() {
        when(loginService.findByToken("token")).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, () -> {underTest.deleteProduct("token", pdr);});
    }

    @Test
    void shouldThrowExceptionWhenGettingFromANotAdmin() {
        when(loginService.findByToken("token")).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, () -> {underTest.findAllProducts("token");});
    }



    @Test
    void deleteProduct() {
    }
}