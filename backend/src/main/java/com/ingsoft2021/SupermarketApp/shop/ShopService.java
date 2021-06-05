package com.ingsoft2021.SupermarketApp.shop;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.request.CatalogueRequest;
import com.ingsoft2021.SupermarketApp.util.request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProductService;
import com.ingsoft2021.SupermarketApp.util.Checker;
import com.ingsoft2021.SupermarketApp.util.ShopComparator;
import com.ingsoft2021.SupermarketApp.util.ShopDistSupport;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class ShopService {

    private final ShopRepository shopRepository;
    private final ShopProductService shopProductService;
    private static final int KM_RADIUS = 4;



    public List<ShopProduct> getInventory(CatalogueRequest request) throws NoSuchFieldException {
        //checking the request format
        Checker.check(request);
        List<ShopDistSupport> shopAndDistance = getNearestShopsOfSupermarket(request);
        //If the list is not empty, return the first element
        if(shopAndDistance.size() > 0){
            return shopProductService.findAllByShopId(shopAndDistance.get(0).getShopID());
        }
        //otherwise return an empty list;
        return new ArrayList<ShopProduct>(); //empty
    }


    public List<ShopDistSupport> getNearestShopsOfSupermarket(CatalogueRequest request){
        //Find a list of Objects that contain (ShopId, distance from user)
        List<ShopDistSupport> shopAndDistance = findShopSortByDistaceFrom(request);
        System.out.println(shopAndDistance.size());
        //order this list by distance
        ShopComparator shopComparator = new ShopComparator();
        Collections.sort(shopAndDistance, shopComparator);
        //filter only those in a radius of KM_RADIUS
        shopAndDistance = shopAndDistance.stream().filter(shop -> shop.getDistance() < KM_RADIUS).collect(Collectors.toList());
        System.out.println(shopAndDistance.size());
        return shopAndDistance;
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
        return products;
    }

    public void addInEveryShop(Product product, String supermarketName) throws NoSuchFieldException {
        List<Shop> shopsOfThatSupermarket = shopRepository.findAllBySupermarketName(supermarketName);
        shopProductService.addInEveryShop(product, shopsOfThatSupermarket);
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

    public String getSupermarketName(Long shopId) {
       Optional<Shop> shop = shopRepository.findByShopId(shopId);
       if(shop.isEmpty()) throw new IllegalStateException("SHOP_NOT_FOUND");
       return shop.get().getSupermarketName();
    }

    public void updateQuantity(ShopProduct shopProduct) throws NoSuchFieldException {
        Checker.check(shopProduct);
        Optional<Shop> shop = shopRepository.findByShopId(shopProduct.getShopId());
        if(shop.isEmpty()) throw new IllegalStateException("SHOP_NOT_FOUND");
        shopProductService.update(shopProduct);
    }

    public List<Shop> findShopsBySupermarket(String supermarketName) {
        return shopRepository.findAllBySupermarketName(supermarketName);
    }

    public Shop findById(Long shopId){
        Optional<Shop> shop = shopRepository.findByShopId(shopId);
        if(shop.isEmpty()) throw  new IllegalStateException("SHOP_NOT_FOUND");
        return shop.get();
    }
}
