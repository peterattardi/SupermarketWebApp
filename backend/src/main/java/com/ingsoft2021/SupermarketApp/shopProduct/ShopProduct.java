package com.ingsoft2021.SupermarketApp.shopProduct;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@IdClass(ShopProductId.class)
@Table(name = "shop_product")
public class ShopProduct {
    @Id
    private Long shopId;
    @Id
    private String productName;
    @Id
    private String productBrand;
    private int quantity;
}
