package com.ingsoft2021.SupermarketApp.CartItem;

import com.ingsoft2021.SupermarketApp.util.compositeIds.CartId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, CartId> {

    Optional<CartItem> findByEmailAndShopIdAndProductNameAndProductBrand(
            String email, Long shopId, String productName, String productBrand
    );
}
