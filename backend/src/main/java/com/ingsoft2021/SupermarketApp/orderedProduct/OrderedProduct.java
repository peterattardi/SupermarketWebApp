package com.ingsoft2021.SupermarketApp.orderedProduct;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "ordered_product")
public class OrderedProduct {
    @Id
    @SequenceGenerator(name = "ordered_sequence", sequenceName = "ordered_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ordered_sequence")
    private Long orderedProductId;
    private String productName;
    private String productBrand;
    private int quantity;
    private Long orderId;

    public OrderedProduct(String productName, String productBrand, int quantity) {
        this.productName = productName;
        this.productBrand = productBrand;
        this.quantity = quantity;
    }
}
