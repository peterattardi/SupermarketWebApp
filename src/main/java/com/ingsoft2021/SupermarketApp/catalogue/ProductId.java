package com.ingsoft2021.SupermarketApp.catalogue;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
public class ProductId implements Serializable {
    private String productName;
    private String productBrand;
    private Long supermarketId;
}
