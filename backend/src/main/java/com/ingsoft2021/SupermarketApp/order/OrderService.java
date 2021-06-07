package com.ingsoft2021.SupermarketApp.order;

import com.ingsoft2021.SupermarketApp.CartItem.CartItem;
import com.ingsoft2021.SupermarketApp.CartItem.CartItemService;
import com.ingsoft2021.SupermarketApp.auth.login.Login;
import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import com.ingsoft2021.SupermarketApp.delivery.DeliveryService;
import com.ingsoft2021.SupermarketApp.orderedProduct.OrderedProduct;
import com.ingsoft2021.SupermarketApp.orderedProduct.OrderedProductService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final LoginService loginService;
    private final CartItemService cartItemService;
    private final OrderedProductService orderedProductService;
    private final DeliveryService deliveryService;

    public void order(String token, String supermarketName) throws NoSuchFieldException {
        Login logged = loginService.findByToken(token);
        if(logged.getAppUserRole().name().equals("GUEST")) throw new IllegalStateException("GUEST_NEEDS_TO_REGISTER");
        List<CartItem> cart = cartItemService.findAllByEmailAndSupermarketName(logged.getEmail(), supermarketName);
        Order newOrder = (new Order(logged.getEmail(), supermarketName));
        orderRepository.save(newOrder);
        for(CartItem cartItem : cart){
            OrderedProduct orderedProduct = new OrderedProduct(cartItem.getProductName(), cartItem.getProductBrand(), cartItem.getQuantity());
            orderedProduct.setOrderId(newOrder.getOrderId());
            orderedProductService.addProduct(orderedProduct);
            cartItemService.deleteCartItem(cartItem);
        }

    }

    public List<Order> getOrders(String token) {
        Login logged = loginService.findByToken(token);
        return orderRepository.findByEmail(logged.getEmail());
    }

    public void delete(String token, Long orderId) {
        loginService.deleteByToken(token);
        Optional<Order> order = orderRepository.findByOrderId(orderId);
        if(order.isEmpty()) throw new IllegalStateException("ORDER_NOT_FOUND");
        orderRepository.delete(order.get());
        orderedProductService.deleteByOrderId(orderId);
        deliveryService.deleteByOrderId(orderId);
    }
}
