package com.ingsoft2021.SupermarketApp.product;



import com.ingsoft2021.SupermarketApp.util.Request.ProductDeleteRequest;
import com.ingsoft2021.SupermarketApp.util.RequestChecker;
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
        RequestChecker.check(product);
        productRepository.save(product);
    }


    public void deleteProduct(ProductDeleteRequest request, String supermarketName) throws NoSuchFieldException {
        RequestChecker.check(request, supermarketName);
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
