package com.ingsoft2021.SupermarketApp.shop;

import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProductService;
import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import com.ingsoft2021.SupermarketApp.util.request.CatalogueRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock ShopRepository shopRepository;
    @Mock
    ShopProductService shopProductService;
    @InjectMocks ShopService underTest;

    @Test
    void shouldThrowExceptionWhenInsertingSupermarketNameNull() {
        CatalogueRequest r = new CatalogueRequest(38.00,21.000,null);
        assertThrows(NoSuchFieldException.class, () -> {underTest.getInventory(r);});
    }

    @Test
    void shouldThrowExceptionWhenInsertingSupermarketNameEmpty() {
        CatalogueRequest r = new CatalogueRequest(38.00,21.000,"");
        assertThrows(NoSuchFieldException.class, () -> {underTest.getInventory(r);});
    }

    @Test
    void shouldThrowExceptionWhenInsertingLongitudeNULL() {
        CatalogueRequest r = new CatalogueRequest(null,21.000,"conad");
        assertThrows(NoSuchFieldException.class, () -> {underTest.getInventory(r);});
    }

    @Test
    void shouldThrowExceptionWhenInsertingLatitudeNULL() {
        CatalogueRequest r = new CatalogueRequest(19.982,null,"conad");
        assertThrows(NoSuchFieldException.class, () -> {underTest.getInventory(r);});
    }


    @Test
    void shouldReturnCorrectDistanceProvidingPosition() {
        Double d = underTest.getDistanceFromLatLonInKm(38.567, 12.1234, 39.432, 14.678);
        assertEquals(d, 240.78784271465776);
    }

    @Test
    void shouldReturnIncCorrectDistanceProvidingPosition() {
        Double d = underTest.getDistanceFromLatLonInKm(38.567, 12.1234, 39.432, 14.678);
        assertNotEquals(d, 12);
    }

    @Test
    void shoulThrowExceptionWhenProvidingShopIdNull() {
        ShopProduct s = new ShopProduct(null, "lol", "lol", 2);
        assertThrows(NoSuchFieldException.class, () -> {underTest.updateQuantity(s);});
    }

    @Test
    void shoulThrowExceptionWhenProvidingBroductBrandNUll() {
        ShopProduct s = new ShopProduct(12L, "23", null, 2);
        assertThrows(NoSuchFieldException.class, () -> {underTest.updateQuantity(s);});
    }

    @Test
    void shoulThrowExceptionWhenProvidingBroductBrandEmpty() {
        ShopProduct s = new ShopProduct(12L, "23", "", 2);
        assertThrows(NoSuchFieldException.class, () -> {underTest.updateQuantity(s);});
    }

    @Test
    void shoulThrowExceptionWhenProvidingBroductNameEmpty() {
        ShopProduct s = new ShopProduct(12L, "", "ded", 2);
        assertThrows(NoSuchFieldException.class, () -> {underTest.updateQuantity(s);});
    }

    @Test
    void shoulThrowExceptionWhenProvidingBroductNameNULL() {
        ShopProduct s = new ShopProduct(12L, null, "ded", 2);
        assertThrows(NoSuchFieldException.class, () -> {underTest.updateQuantity(s);});
    }

    @Test
    void shoulThrowExceptionWhenProvidingQuantityNegative() {
        ShopProduct s = new ShopProduct(12L, "sss", "ded", -10);
        assertThrows(NoSuchFieldException.class, () -> {underTest.updateQuantity(s);});
    }

}
