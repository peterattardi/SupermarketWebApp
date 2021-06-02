package com.ingsoft2021.SupermarketApp.shopProduct;

import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.util.Request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.shop.Shop;
import com.ingsoft2021.SupermarketApp.util.RequestChecker;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ShopProductService {

    private final ShopProductRepository shopProductRepository;

    public void addInEveryShop(Product product, String supermarketName, List<Shop> shopsOfThatSupermarket) throws NoSuchFieldException {
        RequestChecker.check(product);
        for(Shop shop : shopsOfThatSupermarket){
            shopProductRepository.save(new ShopProduct(
                    shop.getShopId(), product.getProductName(),
                    product.getProductBrand(), 0
            ));
        }
    }

    public void deleteInEveryShop(ProductDeleteRequest product, String supermarketName, List<Shop> shopsOfThatSupermarket) throws NoSuchFieldException {
        RequestChecker.check(product, supermarketName);
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

}


