package com.ingsoft2021.SupermarketApp.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
    Optional<Order> findByOrderId(Long orderId);
    List<Order> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE Order o " +
            "SET o.confirmed = TRUE WHERE o.orderId = ?1")
    void confirmById(Long orderId);


    @Transactional
    @Modifying
    @Query("UPDATE Order o " +
            "SET o.confirmed = FALSE WHERE o.orderId = ?1")
    void disconfirm(Long orderId);
}
