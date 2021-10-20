package com.ingsoft2021.SupermarketApp.util.compositeIds;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class ProductId implements Serializable {
    private String productName;
    private String productBrand;
    private String supermarketName;
}
