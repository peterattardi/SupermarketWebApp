package com.ingsoft2021.SupermarketApp.CartItem;
import com.ingsoft2021.SupermarketApp.shop.ShopService;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
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
    private  final ShopProductService shopProductService;
    private  final ShopService shopService;

    public void addCartItem(CartItem request) throws NoSuchFieldException {
        Checker.check(request);
        shopService.findById(request.getShopId());
        //look for the available quantity
        int availableQuantity = shopProductService.findQuantityByShopIdAndProductNameAndProductBrand(
                request.getShopId(), request.getProductName(), request.getProductBrand()
        );

        //check if the request can be satisfied
        if(request.getQuantity() > availableQuantity) throw new IllegalStateException("QUANTITY_INSUFFICIENT");
        //reserve the quantity
        shopService.updateQuantity(new ShopProduct(
                request.getShopId(), request.getProductName(), request.getProductBrand(),
                availableQuantity - request.getQuantity()
        ));
        //check if cartItem was already present. If it was then only modify quantity
        Optional<CartItem> maybe_present = cartItemRepository.findByEmailAndShopIdAndProductNameAndProductBrand(
                request.getEmail(), request.getShopId(), request.getProductName(), request.getProductBrand()
        );
        if(maybe_present.isEmpty())
            cartItemRepository.save(request);
        else{
            cartItemRepository.save(new CartItem(request, request.getQuantity() + maybe_present.get().getQuantity()));
        }
    }

    public void deleteCartItem(CartItem request) throws NoSuchFieldException {
        Checker.check(request);
        shopService.findById(request.getShopId());
        Optional<CartItem> cartItem = cartItemRepository.findByEmailAndShopIdAndProductNameAndProductBrand(
                request.getEmail(), request.getShopId(), request.getProductName(), request.getProductBrand()
        );
        if(cartItem.isEmpty()) throw new IllegalStateException("CART_ITEM_NOT_FOUND");
        int availableQuantity = shopProductService.findQuantityByShopIdAndProductNameAndProductBrand(
                request.getShopId(), request.getProductName(), request.getProductBrand()
        );
        shopService.updateQuantity(new ShopProduct(
                request.getShopId(), request.getProductName(), request.getProductBrand(),
                availableQuantity + cartItem.get().getQuantity()
        ));

        cartItemRepository.delete(cartItem.get());
    }

    public List<CartItem> findAllByEmail(String email){
        return cartItemRepository.findAllByEmail(email);
    }
}

//TODO: admin should see which products of wiche supermarket are no logenfer avaible

