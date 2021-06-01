package com.ingsoft2021.SupermarketApp.supermarkets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupermarketService {

    private final  SupermarketRepository supermarketRepository;

    @Autowired
    public SupermarketService(SupermarketRepository supermarketRepository) {
        this.supermarketRepository = supermarketRepository;
    }

    public List<Supermarket> getSuperMarkets(){
        return supermarketRepository.findAll();
    }

    public void addNewSupermarket(Supermarket supermarket){
        supermarketRepository.save(supermarket);
    }


}
