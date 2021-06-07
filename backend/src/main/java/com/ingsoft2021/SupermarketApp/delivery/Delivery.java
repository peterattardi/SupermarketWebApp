package com.ingsoft2021.SupermarketApp.delivery;

import lombok.*;
import org.springframework.lang.Nullable;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
public class Delivery {
    @Id
    private Long orderId;
    private LocalDateTime date;
    private String address;
    @Nullable
    private Long shopId;
}
