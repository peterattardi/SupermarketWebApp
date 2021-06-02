package com.ingsoft2021.SupermarketApp.shopProduct;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.product.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.product.ProductService;
import com.ingsoft2021.SupermarketApp.shop.Shop;
import com.ingsoft2021.SupermarketApp.shop.ShopService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ShopProductService {

    private final ShopProductRepository shopProductRepository;
    private final ShopService shopService;
    private final ProductService productService;

    public void addInEveryShop(Product product, String supermarketName) throws NoSuchFieldException {
        productService.checkFieldOfProduct(product);
        List<Shop> shopsOfThatSupermarket = shopService.findAllBySupermarketName(supermarketName);
        for(Shop shop : shopsOfThatSupermarket){
            shopProductRepository.save(new ShopProduct(
                    shop.getShopId(), product.getProductName(),
                    product.getProductBrand(), 0
            ));
        }
    }

    public void deleteInEveryShop(ProductDeleteRequest product, String supermarketName) throws NoSuchFieldException {
        productService.checkFieldOfProduct(product, supermarketName);
        List<Shop> shopsOfThatSupermarket = shopService.findAllBySupermarketName(supermarketName);
        for(Shop shop : shopsOfThatSupermarket){
            Optional<ShopProduct> shopProduct = shopProductRepository
                    .findByShopIdAndProductNameAndProductBrand(
                        shop.getShopId(), product.getProductName(), product.getProductBrand()
                    );
            if(shopProduct.isEmpty()) throw new IllegalStateException("PRODUCT_NOT_FOUND");
            shopProductRepository.delete(shopProduct.get());
        }
    }
}


