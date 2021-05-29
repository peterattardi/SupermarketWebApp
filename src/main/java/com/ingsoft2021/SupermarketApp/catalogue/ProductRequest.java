package com.ingsoft2021.SupermarketApp.catalogue;

import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;

@Getter
@Setter

public class ProductRequest {


    private String productName;
    private String productBrand;
    private String productDescription;
    private String nutritionFacts;
    private Long supplierId;
    private double unitCost;
    private String unitType;
    private Long supermarketId;


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
