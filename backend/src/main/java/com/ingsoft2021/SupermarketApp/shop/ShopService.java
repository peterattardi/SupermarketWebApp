package com.ingsoft2021.SupermarketApp.shop;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.Request.CatalogueRequest;
import com.ingsoft2021.SupermarketApp.util.Request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProductService;
import com.ingsoft2021.SupermarketApp.util.RequestChecker;
import com.ingsoft2021.SupermarketApp.util.ShopComparator;
import com.ingsoft2021.SupermarketApp.util.ShopDistSupport;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopProductService shopProductService;


    public List<ShopProduct> getInventory(CatalogueRequest request) throws NoSuchFieldException {
        RequestChecker.check(request);
        //I need to get a ShopId that corresponds to the closest supermarket to the user
        //I need a list of shopId with distance
        List<ShopDistSupport> shopAndDistance = findShopSortByDistaceFrom(request);
        ShopComparator shopComparator = new ShopComparator();
        Collections.sort(shopAndDistance, shopComparator);
        if(shopAndDistance.size() > 0){
            return shopProductService.findAllByShopId(shopAndDistance.get(0).getShopID());
        }
        return new ArrayList<ShopProduct>(); //empty
    }

    private List<ShopDistSupport> findShopSortByDistaceFrom(CatalogueRequest request) {
        List<Shop> shops = shopRepository.findAllBySupermarketName(request.getSupermarketName());
        List<ShopDistSupport> shopDistSupports = new ArrayList<>(){
        };
        for(Shop shop : shops){
            double distance = getDistanceFromLatLonInKm(
                    shop.getLatitude(), shop.getLongitude(),
                    request.getLatitude(), request.getLongitude()
            );
            shopDistSupports.add(new ShopDistSupport(shop.getShopId(), distance));
        }
        return shopDistSupports;
    }

    public List<ShopProduct> getInventory(Long shopId){
        List<ShopProduct> products = shopProductService.findAllByShopId(shopId);
        return products.stream().filter(p -> p.getQuantity() > 0).collect(Collectors.toList());
    }

    public void addInEveryShop(Product product, String supermarketName) throws NoSuchFieldException {
        List<Shop> shopsOfThatSupermarket = shopRepository.findAllBySupermarketName(supermarketName);
        shopProductService.addInEveryShop(product, supermarketName, shopsOfThatSupermarket);
    }

    public void deleteInEveryShop(ProductDeleteRequest request, String supermarketName) throws NoSuchFieldException {
        List<Shop> shopsOfThatSupermarket = shopRepository.findAllBySupermarketName(supermarketName);
        shopProductService.deleteInEveryShop(request, supermarketName, shopsOfThatSupermarket);
    }

    public double getDistanceFromLatLonInKm(double lat1,double lon1,double lat2,double lon2) {
        int hearthRadius = 6371; // Radius of the earth in km
        double dLat = deg2rad(lat2-lat1);  // deg2rad below
        double dLon = deg2rad(lon2-lon1);
        double a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                                Math.sin(dLon/2) * Math.sin(dLon/2)
                ;
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        double d = hearthRadius * c; // Distance in km
        return d;
    }

    public double deg2rad(double deg) {
        return deg * (Math.PI/180);
    }
}
