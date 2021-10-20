package com.ingsoft2021.SupermarketApp.supermarkets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupermarketRepository extends JpaRepository<Supermarket, String> {
    List<Supermarket> findAllByName(String name);
}
