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
import java.util.Optional;

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

    public Delivery getDelivery(Long orderId) {
        Optional<Delivery> delivery = deliveryRepository.findById(orderId);
        if(delivery.isEmpty()) throw new IllegalStateException("DELIVERY_NOT_FOUND");
        return delivery.get();
    }
    
    public void update(Long orderId, Delivery delivery) {
        Optional<Delivery> delivered = deliveryRepository.findById(orderId);
        if(delivered.isEmpty()) throw new IllegalStateException("DELIVERY_NOT_FOUND");
        Delivery newDelivery = new Delivery(delivered.get().getOrderId(), delivery.getDate(), delivery.getAddress(),
                delivery.getPayment(), delivered.get().getShopId());
        deliveryRepository.delete(delivered.get());
        deliveryRepository.save(newDelivery);

    }
    //TODO: orderNow
}
