package com.ingsoft2021.SupermarketApp.delivery;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    void deleteAllByOrderId(Long orderId);
}
