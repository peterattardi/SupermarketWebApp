package com.ingsoft2021.SupermarketApp.product;



import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import com.ingsoft2021.SupermarketApp.supermarkets.SupermarketService;
import com.ingsoft2021.SupermarketApp.util.request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.util.Checker;
import com.ingsoft2021.SupermarketApp.util.request.UpdateProductRequest;
import lombok.AllArgsConstructor;

import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;


@AllArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SupermarketService supermarketService;

    public void addProduct(Product product) throws NoSuchFieldException {
        Checker.check(product);
        productRepository.save(product);
    }


    public void deleteProduct(ProductDeleteRequest request, String supermarketName) throws NoSuchFieldException {
        Checker.check(request, supermarketName);
        Optional<Product> toDelete = productRepository.findByProductNameAndProductBrandAndSupermarketName(request.getProductName(),
                request.getProductBrand()
                ,supermarketName
        );
        if (toDelete.isEmpty()) throw new NoSuchElementException("PRODUCT_NOT_FOUND");
        productRepository.delete(toDelete.get());
    }

    public List<Product> findAllBySupermarketName(String supermarketName) {
        List<String> supermarkets = supermarketService.findAll();
        if(!supermarkets.contains(supermarketName)) throw new IllegalStateException("SUPERMARKET_NOT_FOUND");
        return productRepository.findAllBySupermarketName(supermarketName);
    }

    public Optional<Product> findByProductNameAndProductBrandAndSupermarketName(String productName, String productBrand, String supermarketName){
        return productRepository.findByProductNameAndProductBrandAndSupermarketName(productName, productBrand, supermarketName);
    }


    public void updateProduct(UpdateProductRequest product) throws NoSuchFieldException {
        Optional<Product> maybe_present = productRepository.findByProductNameAndProductBrandAndSupermarketName(
                product.getNewProductName(), product.getNewProductBrand(), product.getSupermarketName()
        );
        if(maybe_present.isPresent()){
            addProduct(new Product(product.getOldProductName(), product.getOldProductBrand(),
                    product.getProductDescription(), product.getNutritionFacts(), product.getSupplierId(),
                    product.getUnitCost(), product.getUnitType(), product.getSupermarketName(),
                    product.getUrl()));
        }
        Optional<Product> oldProduct = productRepository.findByProductNameAndProductBrandAndSupermarketName(
                product.getOldProductName(), product.getOldProductBrand(), product.getSupermarketName()
        );
        if(oldProduct.isEmpty()) throw new IllegalStateException("PRODUCT_NOT_FOUND");
        Product newProduct = new Product(product.getNewProductName(), product.getNewProductBrand(),
                product.getProductDescription(), product.getNutritionFacts(), product.getSupplierId(), product.getUnitCost(),
                product.getUnitType(), product.getSupermarketName(), product.getUrl());
        productRepository.delete(oldProduct.get());
        productRepository.save(newProduct);
    }
}
