package com.ingsoft2021.SupermarketApp.shop;

import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    Optional<Shop> findByShopId(Long shopId);
    List<Shop> findAllBySupermarketName(String supermarketName);
    Optional<String> findSupermarketNameByShopId(Long ShopId);
}
