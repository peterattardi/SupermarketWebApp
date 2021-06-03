package com.ingsoft2021.SupermarketApp.util.compositeIds;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class CartId implements Serializable {
    private String email;
    private Long shopId;
    private String productName;
    private String productBrand;
}
