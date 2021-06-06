package com.ingsoft2021.SupermarketApp.util.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.Nullable;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CartItemRequest {
    private String supermarketName;
    private String productName;
    private String productBrand;
    @Nullable
    private int quantity;
}
