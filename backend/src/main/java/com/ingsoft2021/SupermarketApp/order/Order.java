package com.ingsoft2021.SupermarketApp.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "user_order")
public class Order {
    @Id
    @SequenceGenerator(name = "order_sequence", sequenceName = "order_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_sequence")
    private Long orderId;
    private String email;
    private String supermarket;
    private LocalDateTime createdAt;

    public Order(String email, String supermarket) {
        this.email = email;
        this.supermarket = supermarket;
        this.createdAt = LocalDateTime.now();
    }
}
