package com.ingsoft2021.SupermarketApp.delivery;

import com.ingsoft2021.SupermarketApp.order.OrderService;
import com.ingsoft2021.SupermarketApp.orderedProduct.OrderedProduct;
import com.ingsoft2021.SupermarketApp.orderedProduct.OrderedProductRepository;
import com.ingsoft2021.SupermarketApp.orderedProduct.OrderedProductService;
import com.ingsoft2021.SupermarketApp.shop.ShopService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;
    private final ShopService shopService;
    private final OrderedProductRepository orderedProductRepository;

    public void schedule(Delivery delivery) {
        deliveryRepository.save(delivery);
    }

    @Transactional
    public void deleteByOrderId(Long orderId) {
        deliveryRepository.deleteAllByOrderId(orderId);
    }
    //TODO: orderNow
}
