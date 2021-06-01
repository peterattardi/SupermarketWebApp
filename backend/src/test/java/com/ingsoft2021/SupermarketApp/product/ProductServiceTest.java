package com.ingsoft2021.SupermarketApp.product;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @InjectMocks ProductService underTest;
    @Mock ProductRepository productRepository;
    Product p1, p2, p3;
    ProductDeleteRequest pdr;

    @BeforeEach
    void setUp() {
        p1 = new Product("one","brand_one","no_desc","no_facts",2L,1,"grams","conad");
        p2 = new Product("two","brand_two","no_desc","no_facts",2L,1,"grams","conad");
        p3 = new Product("three","brand_three","no_desc","no_facts",2L,1,"grams","conad");
        pdr = new ProductDeleteRequest(p1.getProductName(), p1.getProductBrand());
    }

    @Test
    void shouldAddAProductCorrectly() {
        when(productRepository.findByProductNameAndProductBrandAndSupermarketName(
                                                        p1.getProductName(),
                                                        p1.getProductBrand(),
                                                        p1.getSupermarketName())).thenReturn(Optional.of(p1));

        assertEquals(p1, underTest.findByProductNameAndProductBrandAndSupermarketName(p1.getProductName(), p1.getProductBrand(), p1.getSupermarketName()).get());
    }

    @Test
    void shouldThrowExceptionWhenAddingAProductWithANULLName(){
        p1.setProductName(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.addProduct(p1);});
    }

    @Test
    void shouldThrowExceptionWhenAddingAProductWithANULLBrand(){
        p1.setProductBrand(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.addProduct(p1);});
    }

    @Test
    void shouldThrowExceptionWhenAddingAProductWithAnEmptyName(){
        p1.setProductName("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.addProduct(p1);});
    }

    @Test
    void shouldThrowExceptionWhenAddingAProductWithAnEmptyBrand(){
        p1.setProductBrand("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.addProduct(p1);});
    }


    @Test
    void shouldDeleteAProductCorrectly() {
        when(productRepository.findByProductNameAndProductBrandAndSupermarketName(
           p1.getProductName(), p1.getProductBrand(), p1.getSupermarketName()
        )).thenReturn(Optional.of(p1));
        assertDoesNotThrow(()->{underTest.deleteProduct(pdr,p1.getSupermarketName());});
    }

    @Test
    void shouldThrowExceptionWhenDeletingAProductWithNULLName(){
        pdr.setProductName(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.deleteProduct(pdr, "conad");});
    }

    @Test
    void shouldThrowExceptionWhenDeletingAProductWithEmptyName(){
        pdr.setProductName("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.deleteProduct(pdr, "conad");});
    }

    @Test
    void shouldThrowExceptionWhenDeletingAProductWithNULLBrand(){
        pdr.setProductBrand(null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.deleteProduct(pdr, "conad");});
    }

    @Test
    void shouldThrowExceptionWhenDeletingAProductWithEmptyBrand(){
        pdr.setProductBrand("");
        assertThrows(NoSuchFieldException.class, () -> {underTest.deleteProduct(pdr, "conad");});
    }

    @Test
    void shouldThrowsExceptionWhenDeletingNonExistingProduct(){
        when(productRepository.findByProductNameAndProductBrandAndSupermarketName(p1.getProductName(),
                p1.getProductBrand(), p1.getSupermarketName()))
                .thenReturn(Optional.empty());
        assertThrows(NoSuchElementException.class, () -> {underTest.deleteProduct(pdr, "conad");});
    }





}