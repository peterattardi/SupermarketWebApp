package com.ingsoft2021.SupermarketApp.CartItem;

import com.ingsoft2021.SupermarketApp.util.compositeIds.CartId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, CartId> {

    Optional<CartItem> findByEmailAndSupermarketNameAndProductNameAndProductBrand(
            String email, String supermarketName, String productName, String productBrand
    );

    List<CartItem> findAllByEmail(String email);

    List<CartItem> findAllByEmailAndSupermarketName(String email, String SupermarketName);
}
