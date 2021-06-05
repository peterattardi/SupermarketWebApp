package com.ingsoft2021.SupermarketApp.product;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200/")
public class ProductController {

    private final ProductService productService;

    @GetMapping(path = "any-user/catalogue/{supermarketName}")
    public ResponseEntity getProductsFromSupermarket(@PathVariable(name = "supermarketName") String supermarketName){
        try{
            return ResponseEntity.status(200).body(productService.findAllBySupermarketName(supermarketName));
        }catch (IllegalStateException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
