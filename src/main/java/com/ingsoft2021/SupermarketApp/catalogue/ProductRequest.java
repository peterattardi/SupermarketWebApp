package com.ingsoft2021.SupermarketApp.catalogue;

import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;

import javax.persistence.Column;

public class ProductRequest {
    public String getProductName() {
        return productName;
    }

    public String getProductBrand() {
        return productBrand;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public String getNutritionFacts() {
        return nutritionFacts;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public Long getSupermarketId() {
        return supermarketId;
    }

    private String productName;
    private String productBrand;
    private String productDescription;
    private String nutritionFacts;
    private Long supplierId;
    private double unitCost;
    private String unitType;
    private Long supermarketId;

    public double getUnitCost() {
        return unitCost;
    }

    public String getUnitType() {
        return unitType;
    }

    public ProductRequest(String productName, String productBrand, String productDescription, String nutritionFacts, Long supplierId, double unitCost, String unitType , Long supermarketId) {
        this.productName = productName;
        this.productBrand = productBrand;
        this.productDescription = productDescription;
        this.nutritionFacts = nutritionFacts;
        this.supplierId = supplierId;
        this.unitCost = unitCost;
        this.unitType = unitType;
        this.supermarketId = supermarketId;
    }

}
