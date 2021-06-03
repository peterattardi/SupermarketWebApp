package com.ingsoft2021.SupermarketApp.supermarkets;

import com.ingsoft2021.SupermarketApp.shop.ShopService;
import com.ingsoft2021.SupermarketApp.util.Request.CatalogueRequest;
import com.ingsoft2021.SupermarketApp.util.Request.SupermarketRequest;
import com.ingsoft2021.SupermarketApp.util.Checker;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

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

    public List<Supermarket> findNearestSupermarkets(SupermarketRequest request) throws NoSuchFieldException {
        Checker.check(request);
        List<Supermarket> supermarkets = supermarketRepository.findAll();
        return supermarkets.stream().filter(supermarket -> shopService.getNearestShopsOfSupermarket(
            new CatalogueRequest(request.getLongitude(), request.getLatitude(), supermarket.getName())
        ).size() > 0).collect(Collectors.toList());


    }


}
