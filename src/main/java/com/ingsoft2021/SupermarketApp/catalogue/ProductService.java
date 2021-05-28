package com.ingsoft2021.SupermarketApp.catalogue;

import com.ingsoft2021.SupermarketApp.appuser.AppUser;
import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import com.ingsoft2021.SupermarketApp.supermarkets.SupermarketRepository;
import lombok.AllArgsConstructor;
import net.bytebuddy.implementation.bind.annotation.Super;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class ProductService {

    private ProductRepository productRepository;
    private SupermarketRepository supermarketRepository;

    public void addProduct(ProductRequest productRequest){

        Optional<Supermarket> supermarket = supermarketRepository.findById(productRequest.getSupermarketId());

        productRepository.save(new Product(
                productRequest.getProductName(),
                productRequest.getProductBrand(),
                productRequest.getProductDescription(),
                productRequest.getNutritionFacts(),
                productRequest.getSupplierId(),
                productRequest.getUnitCost(),
                productRequest.getUnitType(),
                supermarket.get()
        ));
    }

    public List<Product> getCatalogue(String supermarketName){
        Optional<Supermarket> supermarket = supermarketRepository.findByName(supermarketName);
        return productRepository.findBySupermarketId(supermarket.get().getId());
    }



}
