package com.ingsoft2021.SupermarketApp.util;

import com.ingsoft2021.SupermarketApp.CartItem.CartItem;
import com.ingsoft2021.SupermarketApp.CartItem.CartItemRepository;
import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.util.Request.*;
import com.ingsoft2021.SupermarketApp.util.email.EmailValidator;

public class Checker {

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

    public static boolean check(LoginRequest l) throws NoSuchFieldException {
        if(l.getEmail() == null || l.getEmail().isEmpty()) throw new NoSuchFieldException("EMAIL_NULL_OR_EMPTY");
        if(l.getPassword() == null || l.getPassword().isEmpty()) throw new NoSuchFieldException("PASSWORD_NULL_OR_EMPTY");
        if(l.getAppUserRole() == null || l.getAppUserRole().isEmpty()) throw new NoSuchFieldException("APPUSERROLE_NULL_OR_EMPTY");
        if(!(l.getAppUserRole().equals("ADMIN") || l.getAppUserRole().equals("USER"))) throw new IllegalStateException("APPUSERROLE_NOT_VALID");
        return true;
    }

    public static boolean check(AppUser r) throws NoSuchFieldException {
        if(r.getEmail() == null || r.getEmail().isEmpty()) throw new NoSuchFieldException("EMAIL_NULL_OR_EMPTY");
        if(r.getAddress() == null || r.getAddress().isEmpty()) throw new NoSuchFieldException("ADDRESS_NULL_OR_EMPTY");
        if(r.getCap() == null || r.getCap().isEmpty()) throw new NoSuchFieldException("CAP_NULL_OR_EMPTY");
        if(r.getCity() == null || r.getCity().isEmpty()) throw new NoSuchFieldException("CITY_NULL_OR_EMPTY");
        if(r.getPassword() == null || r.getPassword().isEmpty()) throw new NoSuchFieldException("PASSWORD_NULL_OR_EMPTY");
        if(r.getFirstName() == null || r.getFirstName().isEmpty()) throw new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if(r.getLastName() == null || r.getLastName().isEmpty()) throw new NoSuchFieldException("SURNAME_NULL_OR_EMPTY");
        if(r.getPassword().length()<6) throw new IllegalStateException("INVALID_PASSWORD");
        return true;
    }

    public static boolean check(SupermarketRequest request) throws NoSuchFieldException {
        if(request.getLatitude() == null) throw new NoSuchFieldException("LATITUDE_NULL");
        if(request.getLongitude() == null) throw new NoSuchFieldException("LONGITUDE_NULL");
        return true;
    }

    public static boolean check(ShopProduct s) throws NoSuchFieldException {
        if(s.getShopId() == null) throw  new NoSuchFieldException("SHOP_ID_NULL");
        if(s.getProductBrand() == null || s.getProductBrand().isEmpty()) throw  new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(s.getProductName() == null || s.getProductName().isEmpty()) throw  new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if( (Integer) s.getQuantity() == null) throw  new NoSuchFieldException("QUANTITY_NULL");
        if(  s.getQuantity() < 0) throw  new NoSuchFieldException("QUANTITY_NEGATIVE");
        return true;
    }

    public static boolean check(CartItemDeleteRequest c) throws NoSuchFieldException {
        if(c.getShopId() == null) throw new NoSuchFieldException("SHOP_ID_NULL");
        if(c.getEmail() == null) throw new NoSuchFieldException("EMAIL_NULL");
        if(!new EmailValidator().test(c.getEmail())) throw new IllegalStateException("WRONG_EMAIL_FORMAT");
        if(c.getProductBrand() == null || c.getProductBrand().isEmpty()) throw  new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(c.getProductName() == null || c.getProductName().isEmpty()) throw  new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        return true;
    }

    public static boolean check(CartItem c) throws NoSuchFieldException {
        if(c.getShopId() == null) throw new NoSuchFieldException("SHOP_ID_NULL");
        if(c.getEmail() == null) throw new NoSuchFieldException("EMAIL_NULL");
        if(!new EmailValidator().test(c.getEmail())) throw new IllegalStateException("WRONG_EMAIL_FORMAT");
        if(c.getProductBrand() == null || c.getProductBrand().isEmpty()) throw  new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(c.getProductName() == null || c.getProductName().isEmpty()) throw  new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if( (Integer) c.getQuantity() == null) throw  new NoSuchFieldException("QUANTITY_NULL");
        if( c.getQuantity() < 0) throw  new NoSuchFieldException("QUANTITY_NEGATIVE");
        return true;
    }

    public static boolean check(CartItemRequest c) throws NoSuchFieldException {
        if(c.getShopId() == null) throw new NoSuchFieldException("SHOP_ID_NULL");
        if(c.getProductBrand() == null || c.getProductBrand().isEmpty()) throw  new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(c.getProductName() == null || c.getProductName().isEmpty()) throw  new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if( (Integer) c.getQuantity() == null) throw  new NoSuchFieldException("QUANTITY_NULL");
        if( c.getQuantity() < 1) throw  new NoSuchFieldException("QUANTITY_NEGATIVE");
        return true;
    }
}
