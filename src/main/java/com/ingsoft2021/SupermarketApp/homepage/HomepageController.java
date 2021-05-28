package com.ingsoft2021.SupermarketApp.homepage;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class HomepageController {

    @GetMapping(path="/")
    public String home(){
        return "<h1> Home </h1>";
    }

    @GetMapping(path = "/admin")
    public String admin(){
        return "<h1> Admin </h1>";
    }





}
