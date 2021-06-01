package com.ingsoft2021.SupermarketApp.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ProductRepository extends JpaRepository<Product, Long> {


    List<Product> findAllBySupermarketName(String supermarketName);
    Optional<Product> findByProductNameAndProductBrandAndSupermarketName(String productBrand, String productBrand1, String supermarketName);
}