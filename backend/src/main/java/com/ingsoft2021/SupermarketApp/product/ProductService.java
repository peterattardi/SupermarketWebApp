package com.ingsoft2021.SupermarketApp.product;



import com.ingsoft2021.SupermarketApp.shop.ShopRepository;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProductRepository;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


@AllArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;

    public void addProduct(Product product) throws NoSuchFieldException {
        checkFieldOfProduct(product);
        productRepository.save(product);
    }

    public boolean checkFieldOfProduct(Product p) throws NoSuchFieldException {
        if(p.getProductName() == null || p.getProductName().isEmpty())
            throw new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if(p.getProductBrand() == null || p.getProductBrand().isEmpty())
            throw new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(p.getSupermarketName() == null || p.getSupermarketName().isEmpty())
            throw new NoSuchFieldException("SUPERMARKET_NULL_OR_EMPTY");
        return true;
    }

    public boolean checkFieldOfProduct(ProductDeleteRequest p, String supermarketName) throws NoSuchFieldException {
        if(p.getProductName() == null || p.getProductName().isEmpty()) throw new NoSuchFieldException("NAME_NULL_OR_EMPTY");
        if(p.getProductBrand() == null || p.getProductBrand().isEmpty()) throw new NoSuchFieldException("BRAND_NULL_OR_EMPTY");
        if(supermarketName == null || supermarketName.isEmpty()) throw new NoSuchFieldException("SUPERMARKET_NULL_OR_EMPTY");
        return true;
    }


    public void deleteProduct(ProductDeleteRequest request, String supermarketName) throws NoSuchFieldException {
        checkFieldOfProduct(request, supermarketName);
        Optional<Product> toDelete = productRepository.findByProductNameAndProductBrandAndSupermarketName(request.getProductName(),
                request.getProductBrand()
                ,supermarketName
        );
        if (toDelete.isEmpty()) throw new NoSuchElementException("PRODUCT_NOT_FOUND");
        productRepository.delete(toDelete.get());
    }

    public List<Product> findAllBySupermarketName(String supermarketName) {
        return productRepository.findAllBySupermarketName(supermarketName);
    }

    public Optional<Product> findByProductNameAndProductBrandAndSupermarketName(String productName, String productBrand, String supermarketName){
        return productRepository.findByProductNameAndProductBrandAndSupermarketName(productName, productBrand, supermarketName);
    }
}
