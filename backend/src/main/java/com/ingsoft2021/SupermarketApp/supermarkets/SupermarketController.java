package com.ingsoft2021.SupermarketApp.supermarkets;

import com.ingsoft2021.SupermarketApp.util.request.SupermarketRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin( origins = {"https://supermarketapp-ingsoft2021.web.app/", "http://localhost:4200/"})
public class SupermarketController {

    public final SupermarketService supermarketService;

    @Autowired
    public SupermarketController(SupermarketService supermarketService) {
        this.supermarketService = supermarketService;
    }

    @PostMapping(path= "user/nearest-supermarkets")
    public ResponseEntity getSupermarkets(@RequestBody SupermarketRequest request){
        try {
            return ResponseEntity.status(200).body(supermarketService.findNearestSupermarkets(request));
        } catch (NoSuchFieldException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

}
