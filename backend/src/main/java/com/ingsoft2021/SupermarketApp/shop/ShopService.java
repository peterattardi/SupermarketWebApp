package com.ingsoft2021.SupermarketApp.shop;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ShopService {

    private final ShopRepository shopRepository;

    public List<Shop> findAllBySupermarketName(String supermarketName){
        return shopRepository.findAllBySupermarketName(supermarketName);
    }

}
