package com.ingsoft2021.SupermarketApp.util.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
public class ProductDeleteRequest {
    private String productName;
    private String productBrand;
}
