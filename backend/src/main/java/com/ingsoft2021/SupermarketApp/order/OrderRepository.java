package com.ingsoft2021.SupermarketApp.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
    Optional<Order> findByOrderId(Long orderId);
    List<Order> findByEmail(String email);
}
