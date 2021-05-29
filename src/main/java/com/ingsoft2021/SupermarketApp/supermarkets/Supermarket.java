package com.ingsoft2021.SupermarketApp.supermarkets;

import com.ingsoft2021.SupermarketApp.catalogue.Product;

import javax.persistence.*;
import java.util.List;


@Entity
@Table(name = "supermarket")
public class Supermarket {
    @Override
    public String toString() {
        return "Supermarket{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", adminId=" + adminId +
                '}';
    }

    @Id
    @SequenceGenerator(
            name = "supermarket_sequence",
            sequenceName = "supermarket_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "supermarket_sequence"
    )

    private Long id;
    private String name;
    private Long adminId;

    public Supermarket() {
    }

    public Supermarket(String name, Long adminID) {
        this.name = name;
        this.adminId = adminID;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getAdminId() {
        return adminId;
    }
}
