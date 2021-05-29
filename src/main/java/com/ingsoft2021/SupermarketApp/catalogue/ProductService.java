package com.ingsoft2021.SupermarketApp.catalogue;



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
                productRequest.getSupermarketId()
        ));
    }


    public void deleteProduct(ProductDeleteRequest request, Long supermarketId) {
        productRepository.delete(
                productRepository.findByProductNameAndProductBrandAndSupermarketId(request.getProductName(),
                                                    request.getProductBrand()
                                                    ,supermarketId
                ).get()
        );
    }

    public List<Product> findAllBySupermarketId(Long supermarketId) {
        return productRepository.findAllBySupermarketId(supermarketId);
    }
}
