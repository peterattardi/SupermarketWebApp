package com.ingsoft2021.SupermarketApp.CartItem;
import com.ingsoft2021.SupermarketApp.util.Checker;
import com.ingsoft2021.SupermarketApp.util.Request.CartItemDeleteRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CartItemService {
    CartItemRepository cartItemRepository;

    public void addCartItem(CartItem request) throws NoSuchFieldException {
        Checker.check(request);
        cartItemRepository.save(request);
    }

    public void deleteCartItem(CartItemDeleteRequest request) throws NoSuchFieldException {
        Checker.check(request);
        Optional<CartItem> cartItem = cartItemRepository.findByEmailAndShopIdAndProductNameAndProductBrand(
                request.getEmail(), request.getShopId(), request.getProductName(), request.getProductBrand()
        );
        if(cartItem.isEmpty()) throw new IllegalStateException("CART_ITEM_NOT_FOUND");
        cartItemRepository.delete(cartItem.get());
    }
}

//TODO: for now, you can add to the cart more item than present in the inventory
//TODO: for now, there is not check that the shopID exists
//TODO: for now, delete method accepts an email in the body but is not needed
//TODO: for now, nothing happens to the cart if a guest decides to register himself

