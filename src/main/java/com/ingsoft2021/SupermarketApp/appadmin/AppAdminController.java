package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.catalogue.Product;
import com.ingsoft2021.SupermarketApp.catalogue.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.catalogue.ProductRequest;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@AllArgsConstructor
@RestController
public class AppAdminController {

    private final AppAdminService appAdminService;


    @GetMapping(path = "admin/get-products")
    public ResponseEntity<List<Product>> findAllProducts(@RequestParam String token){
        try{
            List<Product> products = appAdminService.findAllProducts(token);
            return ResponseEntity.status(200).body(products);
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(401).body(null);
        }
    }


    @PostMapping(path = "admin/add-product")
    public ResponseEntity<Boolean> addProduct(@RequestBody ProductRequest product, @RequestParam String token){
        try {
            appAdminService.addProduct(product, token);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body(false);
        }
    }

    //For Riccardo: specify {"productName, productBrand"} in the body and I'll figure out supermarketId
    //by myself from the token
    @DeleteMapping(path = "admin/delete-product/")
    public ResponseEntity<Boolean> deleteProduct(@RequestParam String token, @RequestBody ProductDeleteRequest request){
        try{
            appAdminService.deleteProduct(token, request);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalArgumentException | NoSuchElementException e){
            return ResponseEntity.status(401).body(false);
        }
    }







}
