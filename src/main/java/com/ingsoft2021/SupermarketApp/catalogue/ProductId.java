package com.ingsoft2021.SupermarketApp.catalogue;

import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@NoArgsConstructor
public class ProductId implements Serializable {
    private String productName;
    private String productBrand;
    private Long supermarket;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProductId productId = (ProductId) o;
        return productName.equals(productId.productName) && productBrand.equals(productId.productBrand) && supermarket.equals(productId.supermarket);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productName, productBrand, supermarket);
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

    public Long getSupermarket() {
        return supermarket;
    }

    public void setSupermarketId(Long supermarket) {
        this.supermarket = supermarket;
    }

    public ProductId(String productName, String productBrand, Long supermarket) {
        this.productName = productName;
        this.productBrand = productBrand;
        this.supermarket = supermarket;
    }
}
