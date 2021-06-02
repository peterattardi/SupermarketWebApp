package com.ingsoft2021.SupermarketApp.util;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.Request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.util.Request.CatalogueRequest;

public class RequestChecker {

    public static boolean check(Product p) throws NoSuchFieldException {
        if(p.getProductName() == null || p.getProductName().isEmpty())
            throw new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if(p.getProductBrand() == null || p.getProductBrand().isEmpty())
            throw new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(p.getSupermarketName() == null || p.getSupermarketName().isEmpty())
            throw new NoSuchFieldException("SUPERMARKET_NULL_OR_EMPTY");
        return true;
    }

    public static boolean check(ProductDeleteRequest p, String supermarketName) throws NoSuchFieldException {
        if(p.getProductName() == null || p.getProductName().isEmpty()) throw new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if(p.getProductBrand() == null || p.getProductBrand().isEmpty()) throw new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(supermarketName == null || supermarketName.isEmpty()) throw new NoSuchFieldException("SUPERMARKET_NULL_OR_EMPTY");
        return true;
    }


    public static boolean check(CatalogueRequest request) throws NoSuchFieldException {
        if(request.getSupermarketName() == null || request.getSupermarketName().isEmpty()) throw new NoSuchFieldException("SUPERMARKET_NULL_OR_EMPTY");
        if(request.getLatitude() == null) throw  new NoSuchFieldException("LATITUDE_NULL");
        if(request.getLongitude() == null) throw  new NoSuchFieldException("LONGITUDE_NULL");
        return true;
    }
}
