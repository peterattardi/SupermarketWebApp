package com.ingsoft2021.SupermarketApp.util.request;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {
    private String oldProductName;
    private String oldProductBrand;
    private String newProductName;
    private String newProductBrand;
    private String productDescription;
    private String nutritionFacts;
    private Long supplierId;
    private double unitCost;
    private String unitType;
    private String supermarketName;
    private String url;
}
