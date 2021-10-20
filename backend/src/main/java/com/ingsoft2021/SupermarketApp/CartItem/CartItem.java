package com.ingsoft2021.SupermarketApp.CartItem;

import com.ingsoft2021.SupermarketApp.util.request.CartItemRequest;
import com.ingsoft2021.SupermarketApp.util.compositeIds.CartId;
import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.Column;
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
    @Column(columnDefinition = "varchar(50)")
    private String supermarketName;
    @Id
    @Column(columnDefinition = "varchar(50)")
    private String productName;
    @Id
    @Column(columnDefinition = "varchar(50)")
    private String productBrand;
    private int quantity;
    @Nullable
    private LocalDateTime expiresAt;

    public CartItem(CartItemRequest request, String email){
        this.email = email;
        this.productName = request.getProductName();
        this.productBrand = request.getProductBrand();
        this.quantity = request.getQuantity();
        this.supermarketName = request.getSupermarketName();
    }

    public CartItem(CartItem request, int quantity) {
        this.email = request.getEmail();
        this.productName = request.getProductName();
        this.productBrand = request.getProductBrand();
        this.quantity = request.getQuantity();
        this.supermarketName = request.getSupermarketName();
        this.quantity = quantity;

    }
}
