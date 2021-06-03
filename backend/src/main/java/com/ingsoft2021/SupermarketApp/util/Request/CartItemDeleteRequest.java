package com.ingsoft2021.SupermarketApp.util.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDeleteRequest {
    private String email;
    private Long shopId;
    private String productName;
    private String productBrand;
}
