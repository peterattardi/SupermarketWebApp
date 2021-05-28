package com.ingsoft2021.SupermarketApp.catalogue;

import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySupermarketId(Long supermarketId);

}
