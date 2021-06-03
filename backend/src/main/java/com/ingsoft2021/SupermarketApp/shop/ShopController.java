package com.ingsoft2021.SupermarketApp.shop;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminService;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.util.Request.CatalogueRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
            AppAdmin admin = appAdminService.findAdminByToken(token);
            String supermarketName = shopService.getSupermarketName(shopId);
            if(!admin.getSupermarketName().equals(supermarketName)) throw new IllegalStateException("UNAUTHORIZED");
            List<ShopProduct> products = shopService.getInventory(shopId);
            return ResponseEntity.status(200).body(products);
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PutMapping(path= "admin/update-quantity")
    public ResponseEntity updateQuantity(@RequestParam String token, @RequestBody ShopProduct shopProduct){
        try{
            AppAdmin admin = appAdminService.findAdminByToken(token);
            String supermarketName = shopService.getSupermarketName(shopProduct.getShopId());
            if(!admin.getSupermarketName().equals(supermarketName)) throw new IllegalStateException("UNAUTHORIZED");
            shopService.updateQuantity(shopProduct);
            return ResponseEntity.status(200).body("SUCCESS");

        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "admin/get-shops")
    public ResponseEntity getShops(@RequestParam String token){
        try{
            AppAdmin admin = appAdminService.findAdminByToken(token);
            List<Shop> shops = shopService.findShopsBySupermarket(admin.getSupermarketName());
            return ResponseEntity.status(200).body(shops);

        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

}
