package com.ingsoft2021.SupermarketApp.supermarkets;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupermarketRepository extends JpaRepository<Supermarket, Long> {
    Optional<Supermarket> findById(Long id);
    Optional<Supermarket> findByName(String name);

}
