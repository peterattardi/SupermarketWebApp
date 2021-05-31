package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.product.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.product.ProductRequest;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.List;
import java.util.NoSuchElementException;

@AllArgsConstructor
@RestController
public class AppAdminController {

    private final AppAdminService appAdminService;


    @GetMapping(path = "admin/get-products")
    public ResponseEntity findAllProducts(@RequestParam String token){
        try{
            List<Product> products = appAdminService.findAllProducts(token);
            return ResponseEntity.status(200).body(products);
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    @PostMapping(path = "admin/add-product")
    public ResponseEntity addProduct(@RequestBody ProductRequest product, @RequestParam String token){
        try {
            appAdminService.addProduct(product, token);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    //For Riccardo: specify {"productName, productBrand"} in the body and I'll figure out supermarketId
    //by myself from the token
    @DeleteMapping(path = "admin/delete-product")
    public ResponseEntity deleteProduct(@RequestParam String token, @RequestBody ProductDeleteRequest request){
        try{
            appAdminService.deleteProduct(token, request);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalStateException | NoSuchElementException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }







}
