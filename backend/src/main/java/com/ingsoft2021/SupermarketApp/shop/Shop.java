package com.ingsoft2021.SupermarketApp.shop;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "shop")
public class Shop {

    @Id
    @SequenceGenerator(name = "shop_sequence", sequenceName = "shop_sequence", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "shop_sequence")
    private Long shopId;
    private String supermarketName;
    private Double longitude;
    private Double latitude;

    public Shop(String supermarketName, Double longitude, Double latitude) {
        this.supermarketName = supermarketName;
        this.longitude = longitude;
        this.latitude = latitude;
    }
}
