package com.ingsoft2021.SupermarketApp.util.Request;

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
    private Long shopId;
    private String productName;
    private String productBrand;
    @Nullable
    private int quantity;

}
