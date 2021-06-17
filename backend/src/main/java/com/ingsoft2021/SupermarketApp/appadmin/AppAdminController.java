package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.request.ProductDeleteRequest;

import com.ingsoft2021.SupermarketApp.util.request.UpdateProductRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@AllArgsConstructor
@RestController
@CrossOrigin( origins = {"https://supermarketapp-ingsoft2021.web.app/", "http://localhost:4200/"})


public class AppAdminController {

    private final AppAdminService appAdminService;


    @GetMapping(path = "admin/catalogue")
    public ResponseEntity findAllProducts(@RequestParam String token){
        try{
            List<Product> products = appAdminService.findAllProducts(token);
            return ResponseEntity.status(200).body(products);
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @PostMapping(path = "admin/catalogue/add")
    public ResponseEntity addProduct(@RequestBody Product product, @RequestParam String token){
        try {
            appAdminService.addProduct(product, token);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException | NoSuchFieldException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping(path = "admin/catalogue/update")
    public ResponseEntity updateProduct(@RequestBody UpdateProductRequest product, @RequestParam String token){
        try {
            appAdminService.updateProduct(product, token);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException | NoSuchFieldException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //For Riccardo: specify {"productName, productBrand"} in the body and I'll figure out supermarketId
    //by myself from the token
    @PostMapping(path = "admin/catalogue/delete")
    public ResponseEntity deleteProduct(@RequestParam String token, @RequestBody ProductDeleteRequest request){
        try{
            appAdminService.findAdminByToken(token);
            appAdminService.deleteProduct(token, request);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException | NoSuchElementException| NoSuchFieldException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }








}
