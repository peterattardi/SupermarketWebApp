package com.ingsoft2021.SupermarketApp.shop;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminService;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProductService;
import com.ingsoft2021.SupermarketApp.util.request.CatalogueRequest;
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
    public final ShopProductService shopProductService;

    @PostMapping(path = "user/nearest-shop/inventory")
    public ResponseEntity getInventory(@RequestBody CatalogueRequest request){
        try{
            List<ShopProduct> inventory = shopService.getInventory(request);
            return ResponseEntity.status(200).body(inventory);
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @GetMapping(path = "admin/inventory/{shopId}")
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

    @PutMapping(path= "admin/inventory/update")
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

    @GetMapping(path= "admin/unavailables/{shopId}")
    public ResponseEntity getUnavailable(@RequestParam String token, @PathVariable(name = "shopId") Long shopId){
        try {
            AppAdmin admin = appAdminService.findAdminByToken(token);
            Shop shop = shopService.findById(shopId);
            if(!admin.getSupermarketName().equals(shop.getSupermarketName())) throw new IllegalStateException("UNAUTHORIZED");
            List<ShopProduct> unavailables = shopProductService.findUnavailable(shopId);
            return ResponseEntity.status(200).body(unavailables);
        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping(path = "admin/shops")
    public ResponseEntity getShops(@RequestParam String token){
        try{
            AppAdmin admin = appAdminService.findAdminByToken(token);
            List<Shop> shops = shopService.findShopsBySupermarket(admin.getSupermarketName());
            return ResponseEntity.status(200).body(shops);

        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping(path = "any-user/shops")
    public ResponseEntity getAllShops(){
        try{
            List<Shop> shops = shopService.findAllShops();
            return ResponseEntity.status(200).body(shops);

        }catch (IllegalStateException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


}
