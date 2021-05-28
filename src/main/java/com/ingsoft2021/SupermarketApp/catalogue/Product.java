package com.ingsoft2021.SupermarketApp.catalogue;

import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@NoArgsConstructor
@Entity
@IdClass(ProductId.class)
@Table(name = "catalogue")
public class Product {



    @Id
    private String productName;
    @Id
    private String productBrand;
    private String productDescription;
    private String nutritionFacts;
    private Long supplierId;
    private double unitCost;
    private String unitType;
    @Id
    @ManyToOne
    private Supermarket supermarket;


    public Product(String productName, String productBrand, String productDescription, String nutritionFacts, Long supplierId, double unitCost, String unitType, Supermarket supermarket) {
        this.productName = productName;
        this.productBrand = productBrand;
        this.productDescription = productDescription;
        this.nutritionFacts = nutritionFacts;
        this.supplierId = supplierId;
        this.unitCost = unitCost;
        this.unitType = unitType;
        this.supermarket = supermarket;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductBrand() {
        return productBrand;
    }

    public void setProductBrand(String productBrand) {
        this.productBrand = productBrand;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public String getNutritionFacts() {
        return nutritionFacts;
    }

    public void setNutritionFacts(String nutritionFacts) {
        this.nutritionFacts = nutritionFacts;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public Supermarket getSupermarket() {
        return supermarket;
    }

    public void setSupermarket(Supermarket supermarket) {
        this.supermarket = supermarket;
    }
}
