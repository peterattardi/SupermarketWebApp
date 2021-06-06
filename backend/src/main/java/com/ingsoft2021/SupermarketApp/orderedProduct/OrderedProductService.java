package com.ingsoft2021.SupermarketApp.orderedProduct;

import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
public class OrderedProductService {
    private final OrderedProductRepository orderedProductRepository;
    private final LoginService loginService;

    public void addProduct(OrderedProduct product) {
        orderedProductRepository.save(product);
    }

    @Transactional
    public void deleteByOrderId(Long orderId) {
        orderedProductRepository.deleteAllByOrderId(orderId);
    }

    public List<OrderedProduct> getOrderedProducts(String token, Long orderId) {
        loginService.findByToken(token);
        return orderedProductRepository.findAllByOrderId(orderId);
    }
}
