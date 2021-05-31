package com.ingsoft2021.SupermarketApp.product;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

public class ProductRequest {


    private String productName;
    private String productBrand;
    private String productDescription;
    private String nutritionFacts;
    private Long supplierId;
    private double unitCost;
    private String unitType;
    private String supermarketName;


    public ProductRequest(String productName, String productBrand, String productDescription, String nutritionFacts, Long supplierId, double unitCost, String unitType) {
        this.productName = productName;
        this.productBrand = productBrand;
        this.productDescription = productDescription;
        this.nutritionFacts = nutritionFacts;
        this.supplierId = supplierId;
        this.unitCost = unitCost;
        this.unitType = unitType;
    }

}
