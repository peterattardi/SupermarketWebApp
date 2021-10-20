package com.ingsoft2021.SupermarketApp.CartItem;
import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.product.ProductService;
import com.ingsoft2021.SupermarketApp.shop.ShopService;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProductService;
import com.ingsoft2021.SupermarketApp.util.Checker;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartItemService {
    private  final CartItemRepository cartItemRepository;
    private  final ProductService productService;

    public void addCartItem(CartItem request) throws NoSuchFieldException {
        Checker.check(request);
        Optional<Product> product = productService.findByProductNameAndProductBrandAndSupermarketName(request.getProductName(),
                request.getProductBrand(), request.getSupermarketName());
        if(product.isEmpty()) throw new IllegalStateException("PRODUCT_NOT_FOUND");

        Optional<CartItem> maybe_present = cartItemRepository.findByEmailAndSupermarketNameAndProductNameAndProductBrand(
                request.getEmail(), request.getSupermarketName(), request.getProductName(), request.getProductBrand()
        );
        if(maybe_present.isEmpty())
            cartItemRepository.save(request);
        else{
            cartItemRepository.save(new CartItem(request, request.getQuantity()));
        }
    }

    public void deleteCartItem(CartItem request) throws NoSuchFieldException {
        Checker.check(request);
        Optional<CartItem> cartItem = cartItemRepository.findByEmailAndSupermarketNameAndProductNameAndProductBrand(
                request.getEmail(), request.getSupermarketName(), request.getProductName(), request.getProductBrand()
        );
        if(cartItem.isEmpty()) throw new IllegalStateException("CART_ITEM_NOT_FOUND");
        cartItemRepository.delete(cartItem.get());
    }

    public List<CartItem> findAllByEmail(String email){
        return cartItemRepository.findAllByEmail(email);
    }

    public List<CartItem> findAllByEmailAndSupermarketName(String email, String supermarketName) {
        return cartItemRepository.findAllByEmailAndSupermarketName(email, supermarketName);
    }
}


