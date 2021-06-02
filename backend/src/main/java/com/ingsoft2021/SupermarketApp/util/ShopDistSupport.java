package com.ingsoft2021.SupermarketApp.util;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ShopDistSupport implements Comparable<ShopDistSupport> {
    private Long shopID;
    private double distance;

    @Override
    public int compareTo(ShopDistSupport s1){
        return Double.compare(distance, s1.distance);
    }
}
