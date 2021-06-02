package com.ingsoft2021.SupermarketApp.shopProduct;

import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShopProductRepository extends JpaRepository<ShopProduct, ShopProductId> {
    List<ShopProduct> findAllByShopId(Long shopId);
    Optional<Integer> findQuantityByShopIdAndProductNameAndProductBrand(
            Long shopId, String productName, String productBrand
    );

    Optional<ShopProduct> findByShopIdAndProductNameAndProductBrand(Long shopId, String productName, String productBrand);
}
