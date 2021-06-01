package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.appuser.AppUserRole;
import com.ingsoft2021.SupermarketApp.auth.login.Login;
import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import com.ingsoft2021.SupermarketApp.product.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.mock.mockito.MockBean;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppAdminServiceTest {

    @Mock AppAdminRepository appAdminRepository;
    @InjectMocks AppAdminService appAdminService;
    @Mock LoginService loginService;
    @Mock ProductRepository productRepository;
    @Mock ProductService productService;
    AppAdmin admin = new AppAdmin("valid@email.it", "pass", "conad");
    Login login = new Login("valid@email.it", AppUserRole.ADMIN, "token", LocalDateTime.now(), LocalDateTime.now().plusHours(2));
    Product p1 = new Product("p1","p1b",null,null,null,1,null,"conad");
    Product p2 = new Product("p2","p2b",null,null,null,1,null,"conad");
    Product p3 = new Product("p3","p3b",null,null,null,1,null,"conad");
    ProductDeleteRequest p1d = new ProductDeleteRequest("p1","p1b");


    @Test
    void shouldReturnListOfProductIfRequestedFromLoggedAdmin() {
        when(loginService.findAdminByToken("token")).thenReturn(login);
        when(appAdminRepository.findByEmail(login.getEmail())).thenReturn(Optional.of(admin));
        when(productService.findAllBySupermarketName(admin.getSupermarketName())).thenReturn(Arrays.asList(p1,p2,p3));
        assertTrue(appAdminService.findAllProducts("token").containsAll(Arrays.asList(p1,p2,p3)));
    }

    @Test
    void shouldThrowExceptionWhenRequestingProductsFromNonLoggedUser() {
        when(loginService.findAdminByToken("token")).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, () -> {appAdminService.findAllProducts("token");});
    }



    @Test
    void deleteProduct() {
        when(loginService.findAdminByToken("token")).thenReturn(login);
        when(appAdminRepository.findByEmail(login.getEmail())).thenReturn(Optional.of(admin));
        doThrow(IllegalStateException.class).when(productService).deleteProduct(p1d, "conad");
        assertThrows(IllegalStateException.class, () -> {appAdminService.deleteProduct("token",p1d);});
    }

    @Test
    void shouldReturnAnAppAdminWhenProvidingCorrectToken() {
        when(appAdminRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(loginService.findAdminByToken("token")).thenReturn(login);
        AppAdmin appAdmin = appAdminService.findAdminFromToken(login.getToken());
        assertNotNull(appAdmin);
    }

    @Test
    void shouldThrowExceptionWhenProvidingNonExistingToken(){
        when(loginService.findAdminByToken("token")).thenThrow(IllegalStateException.class);
        assertThrows(IllegalStateException.class, () -> {appAdminService.findAdminFromToken(anyString());});
    }

    @Test
    void shouldThrowExceptionWhenUserIsNotAdmin(){
        Login login = new Login("valid@email.it", AppUserRole.USER, "token", LocalDateTime.now(), LocalDateTime.now().plusHours(2));
        assertThrows(IllegalStateException.class, () -> {appAdminService.findAdminFromToken("token");});
    }

    @Test
    void shouldThrowExceptionWhenTokenIsExpired(){
        Login login = new Login("valid@email.it", AppUserRole.ADMIN, "token", LocalDateTime.now(), LocalDateTime.now().minusHours(2));
        assertThrows(IllegalStateException.class, () -> {appAdminService.findAdminFromToken("token");});
    }
}