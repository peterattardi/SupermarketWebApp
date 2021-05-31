package com.ingsoft2021.SupermarketApp.supermarkets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200/")
@RequestMapping(path = "supermarkets")
public class SupermarketController {

    public final SupermarketService supermarketService;

    @Autowired
    public SupermarketController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @GetMapping
    public List<Supermarket> getSupermarkets(){
        return supermarketService.getSuperMarkets();
    }

    @PostMapping
    public void registerSupermarket(@RequestBody Supermarket supermarket){
        supermarketService.addNewSupermarket(supermarket);
    }
}
