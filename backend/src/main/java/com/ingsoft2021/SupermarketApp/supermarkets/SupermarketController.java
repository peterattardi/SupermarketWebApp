package com.ingsoft2021.SupermarketApp.supermarkets;

import com.ingsoft2021.SupermarketApp.util.Request.SupermarketRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity getSupermarkets(@RequestBody SupermarketRequest request){
        try {
            return ResponseEntity.status(200).body(supermarketService.findNearestSupermarkets(request));
        } catch (NoSuchFieldException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping
    public void registerSupermarket(@RequestBody Supermarket supermarket){
        supermarketService.addNewSupermarket(supermarket);
    }


}
