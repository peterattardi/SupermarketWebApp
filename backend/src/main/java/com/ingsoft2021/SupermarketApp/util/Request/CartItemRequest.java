package com.ingsoft2021.SupermarketApp.util.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CartItemRequest {
    private Long shopId;
    private String productName;
    private String productBrand;
    private int quantity;
}
