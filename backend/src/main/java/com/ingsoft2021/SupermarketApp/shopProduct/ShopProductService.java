package com.ingsoft2021.SupermarketApp.shopProduct;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.shop.Shop;
import com.ingsoft2021.SupermarketApp.util.Checker;
import com.ingsoft2021.SupermarketApp.util.request.UpdateProductRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class ShopProductService {

    private final ShopProductRepository shopProductRepository;

    public void addInEveryShop(Product product, List<Shop> shopsOfThatSupermarket) throws NoSuchFieldException {
        Checker.check(product);
        for(Shop shop : shopsOfThatSupermarket){
            shopProductRepository.save(new ShopProduct(
                    shop.getShopId(), product.getProductName(),
                    product.getProductBrand(), 0
            ));
        }
    }

    public void deleteInEveryShop(ProductDeleteRequest product, String supermarketName, List<Shop> shopsOfThatSupermarket) throws NoSuchFieldException {
        Checker.check(product, supermarketName);
        for(Shop shop : shopsOfThatSupermarket){
            Optional<ShopProduct> shopProduct = shopProductRepository
                    .findByShopIdAndProductNameAndProductBrand(
                        shop.getShopId(), product.getProductName(), product.getProductBrand()
                    );
            if(shopProduct.isEmpty()) throw new IllegalStateException("PRODUCT_NOT_FOUND");
            shopProductRepository.delete(shopProduct.get());
        }
    }

    public List<ShopProduct> findAllByShopId(Long shopId){
        return shopProductRepository.findAllByShopId(shopId);
    }

    public void update(ShopProduct shopProduct) {
        Optional<ShopProduct> old = shopProductRepository.findByShopIdAndProductNameAndProductBrand(
          shopProduct.getShopId(), shopProduct.getProductName(), shopProduct.getProductBrand()
        );
        if (old.isEmpty()) throw new IllegalStateException("PRODUCT_NOT_FOUND");
        shopProductRepository.delete(old.get());
        shopProductRepository.save(shopProduct);
    }

    public int findQuantityByShopIdAndProductNameAndProductBrand(
        Long shopId, String productName, String productBrand
    ){
        Optional<ShopProduct> product = shopProductRepository.findByShopIdAndProductNameAndProductBrand(
                shopId, productName, productBrand
        );
        if (product.isEmpty()) throw new IllegalStateException("PRODUCT_NOT_FOUND");
        return  product.get().getQuantity();
    }

    public List<ShopProduct> findUnavailable(Long shopId) {
        List<ShopProduct> products = findAllByShopId(shopId);
        return products.stream().filter(product -> product.getQuantity() < 1).collect(Collectors.toList());
    }

    public void updateInEveryShop(UpdateProductRequest product, List<Shop> shopsOfThatSupermarket) {
        for(Shop shop : shopsOfThatSupermarket){
            Optional<ShopProduct> oldShopProduct = shopProductRepository.findByShopIdAndProductNameAndProductBrand(
                    shop.getShopId(), product.getOldProductName(), product.getOldProductBrand()
            );
            if(oldShopProduct.isEmpty()) throw new IllegalStateException("PPRODUCT_NOT_FOUND");
            shopProductRepository.delete(oldShopProduct.get());
            ShopProduct newShopProduct = new ShopProduct(shop.getShopId(), product.getNewProductName(),
                    product.getNewProductBrand(), oldShopProduct.get().getQuantity());
            shopProductRepository.save(newShopProduct);


        }
    }
}


