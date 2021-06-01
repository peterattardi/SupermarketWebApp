package com.ingsoft2021.SupermarketApp.supermarkets;
import lombok.*;

import javax.persistence.*;


@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
@Entity
@Table(name = "supermarket")
public class Supermarket {


    @Id
    private String name;
}



