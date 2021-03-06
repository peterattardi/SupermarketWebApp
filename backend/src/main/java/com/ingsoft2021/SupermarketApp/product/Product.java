package com.ingsoft2021.SupermarketApp.product;

import com.ingsoft2021.SupermarketApp.util.compositeIds.ProductId;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@IdClass(ProductId.class)
@Table(name = "product")
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
    private String supermarketName;
    private String url;


    public Product(String productName, String productBrand, String productDescription, String nutritionFacts, Long supplierId, double unitCost, String unitType, String supermarketName, String url) {
        this.productName = productName;
        this.productBrand = productBrand;
        this.productDescription = productDescription;
        this.nutritionFacts = nutritionFacts;
        this.supplierId = supplierId;
        this.unitCost = unitCost;
        this.unitType = unitType;
        this.supermarketName = supermarketName;
        this.url = url;
    }

}


