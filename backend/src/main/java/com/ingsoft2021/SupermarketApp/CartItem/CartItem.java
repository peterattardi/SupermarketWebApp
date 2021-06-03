package com.ingsoft2021.SupermarketApp.CartItem;

import com.ingsoft2021.SupermarketApp.util.Request.CartItemDeleteRequest;
import com.ingsoft2021.SupermarketApp.util.Request.CartItemRequest;
import com.ingsoft2021.SupermarketApp.util.compositeIds.CartId;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@IdClass(CartId.class)
public class CartItem {
    @Id
    private String email;
    @Id
    private Long shopId;
    @Id
    private String productName;
    @Id
    private String productBrand;
    private int quantity;
    @Nullable
    private LocalDateTime expiresAt;

    public CartItem(CartItemRequest request, String email){
        this.email = email;
        this.productName = request.getProductName();
        this.productBrand = request.getProductBrand();
        this.quantity = request.getQuantity();
        this.shopId = request.getShopId();
    }
}
