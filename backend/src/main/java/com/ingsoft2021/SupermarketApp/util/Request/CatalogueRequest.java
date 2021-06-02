package com.ingsoft2021.SupermarketApp.util.Request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class CatalogueRequest {
    private Double longitude;
    private Double latitude;
    private String supermarketName;
}
