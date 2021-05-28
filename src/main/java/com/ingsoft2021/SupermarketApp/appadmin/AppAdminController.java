package com.ingsoft2021.SupermarketApp.appadmin;

import com.ingsoft2021.SupermarketApp.catalogue.ProductRequest;
import com.ingsoft2021.SupermarketApp.catalogue.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@AllArgsConstructor
@Controller
public class AppAdminController {

    private AppAdminService appAdminService;
    private ProductService productService;


    @PostMapping(path = "admin/add-product")
    public ResponseEntity<Boolean> addNewProduct(@RequestBody ProductRequest product){
        try {
            productService.addProduct(product);
            return ResponseEntity.status(200).body(true);
        }catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body(false);
        }


    }



}
