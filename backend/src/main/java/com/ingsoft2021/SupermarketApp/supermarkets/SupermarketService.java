package com.ingsoft2021.SupermarketApp.supermarkets;

import com.ingsoft2021.SupermarketApp.shop.Shop;
import com.ingsoft2021.SupermarketApp.shop.ShopService;
import com.ingsoft2021.SupermarketApp.util.ShopDistSupport;
import com.ingsoft2021.SupermarketApp.util.request.CatalogueRequest;
import com.ingsoft2021.SupermarketApp.util.request.SupermarketRequest;
import com.ingsoft2021.SupermarketApp.util.Checker;
import lombok.AllArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.Super;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SupermarketService {

    private final  SupermarketRepository supermarketRepository;
    private final ShopService shopService;



    public List<Supermarket> getSuperMarkets(){
        return supermarketRepository.findAll();
    }

    public void addNewSupermarket(Supermarket supermarket){
        supermarketRepository.save(supermarket);
    }

    public List<Shop> findNearestSupermarkets(SupermarketRequest request) throws NoSuchFieldException {
        Checker.check(request);
        List<Supermarket> supermarkets = supermarketRepository.findAll();
        /*
        return supermarkets.stream().filter(supermarket -> shopService.getNearestShopsOfSupermarket(
            new CatalogueRequest(request.getLongitude(), request.getLatitude(), supermarket.getName())
        ).size() > 0).collect(Collectors.toList());*/

        List<Shop> shops = new ArrayList<>();
        for(Supermarket supermarket : supermarkets){
            List<ShopDistSupport> nearestSupermarket = shopService.getNearestShopsOfSupermarket(
                    new CatalogueRequest(request.getLongitude(), request.getLatitude(), supermarket.getName())
            );
            if(nearestSupermarket.size() > 0){
                ShopDistSupport s = nearestSupermarket.get(0);
                Shop related = shopService.findById(s.getShopID());
                shops.add(related);
            }
        }
        return shops;
    }

    public List<String> findAll(){
        return supermarketRepository.findAll().stream().map(supermarket -> supermarket.getName()).collect(Collectors.toList());
    }
}
