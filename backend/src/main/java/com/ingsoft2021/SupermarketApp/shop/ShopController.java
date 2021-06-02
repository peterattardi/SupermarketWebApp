package com.ingsoft2021.SupermarketApp.shop;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdminService;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.util.Request.CatalogueRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200/")
public class ShopController {

    public final ShopService shopService;
    public final AppAdminService appAdminService;

    @GetMapping(path = "user/products")
    public ResponseEntity getInventory(@RequestBody CatalogueRequest request){
        try{
            List<ShopProduct> inventory = shopService.getInventory(request);
            return ResponseEntity.status(200).body(inventory);
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "admin/products/{shopId}")
    public ResponseEntity getCatalogue(@RequestParam String token, @PathVariable(name = "shopId") Long shopId){
        try {
            appAdminService.findAdminByToken(token);
            List<ShopProduct> products = shopService.getInventory(shopId);
            //TODO: admin from conad cannot access catalogue from deco
            return ResponseEntity.status(200).body(products);
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
