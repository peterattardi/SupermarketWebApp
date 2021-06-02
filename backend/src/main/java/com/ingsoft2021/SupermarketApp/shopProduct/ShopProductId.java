package com.ingsoft2021.SupermarketApp.shopProduct;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ShopProductId implements Serializable {
    private Long shopId;
    private String productName;
    private String productBrand;
}
