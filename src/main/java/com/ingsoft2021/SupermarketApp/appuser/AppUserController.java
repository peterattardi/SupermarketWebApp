package com.ingsoft2021.SupermarketApp.appuser;

import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.catalogue.Product;
import com.ingsoft2021.SupermarketApp.catalogue.ProductRequest;
import com.ingsoft2021.SupermarketApp.catalogue.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
//lol
@Controller
public class AppUserController {

    @Autowired
    private ProductService productService;

    @GetMapping(path = "catalogue/{supermarketName}")
    List<Product> getCatalogue(@PathVariable(name = "supermarketName") String supermarketName) {

        System.out.println( productService.getCatalogue(supermarketName));
        return productService.getCatalogue(supermarketName);
    }

    @GetMapping(path = "suca/suca")
    public String suca(){        return "lol";
    }

}
