package com.ingsoft2021.SupermarketApp.product;



import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;


@AllArgsConstructor
@Service
public class ProductService {

    private final ProductRepository productRepository;

    public void addProduct(ProductRequest productRequest){

        productRepository.save(new Product(
                productRequest.getProductName(),
                productRequest.getProductBrand(),
                productRequest.getProductDescription(),
                productRequest.getNutritionFacts(),
                productRequest.getSupplierId(),
                productRequest.getUnitCost(),
                productRequest.getUnitType(),
                productRequest.getSupermarketName()
        ));
    }


    public void deleteProduct(ProductDeleteRequest request, String supermarketName) {
        productRepository.delete(
                productRepository.findByProductNameAndProductBrandAndSupermarketName(request.getProductName(),
                                                    request.getProductBrand()
                                                    ,supermarketName
                ).get()
        );
    }

    public List<Product> findAllBySupermarketName(String supermarketName) {
        return productRepository.findAllBySupermarketName(supermarketName);
    }
}
