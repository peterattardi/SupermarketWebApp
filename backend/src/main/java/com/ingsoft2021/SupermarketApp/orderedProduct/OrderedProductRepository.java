package com.ingsoft2021.SupermarketApp.orderedProduct;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderedProductRepository extends JpaRepository<OrderedProduct, Long> {
    void deleteAllByOrderId(Long orderId);
    List<OrderedProduct> findAllByOrderId(Long orderId);
}
