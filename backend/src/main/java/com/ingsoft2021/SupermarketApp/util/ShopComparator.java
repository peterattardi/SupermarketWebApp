package com.ingsoft2021.SupermarketApp.util;

import java.util.Comparator;

public class ShopComparator implements Comparator<ShopDistSupport> {
    @Override
    public int compare(ShopDistSupport o1, ShopDistSupport o2) {
        return o1.compareTo(o2);
    }
}
