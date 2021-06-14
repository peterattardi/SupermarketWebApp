package com.ingsoft2021.SupermarketApp.security;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdmin;
import com.ingsoft2021.SupermarketApp.appadmin.AppAdminService;
import com.ingsoft2021.SupermarketApp.product.Product;
import com.ingsoft2021.SupermarketApp.product.ProductRepository;
import com.ingsoft2021.SupermarketApp.shop.Shop;
import com.ingsoft2021.SupermarketApp.shop.ShopRepository;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProduct;
import com.ingsoft2021.SupermarketApp.shopProduct.ShopProductRepository;
import com.ingsoft2021.SupermarketApp.supermarkets.Supermarket;
import com.ingsoft2021.SupermarketApp.supermarkets.SupermarketService;

import lombok.AllArgsConstructor;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import java.util.List;
import java.util.Random;


@EnableWebSecurity
@AllArgsConstructor
public class Config extends WebSecurityConfigurerAdapter {

    private final AppAdminService appAdminService;
    private final SupermarketService supermarketService;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final ShopProductRepository shopProductRepository;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors().disable()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers("/**").permitAll()
                .anyRequest().permitAll();

        appAdminService.signUpAdmin(new AppAdmin("admin@conad.it", "conad-conad", "conad"));
        appAdminService.signUpAdmin(new AppAdmin("admin@deco.it", "deco-deco", "deco"));
        appAdminService.signUpAdmin(new AppAdmin("admin@coop.it", "coop-coop", "coop"));
        appAdminService.signUpAdmin(new AppAdmin("admin@despar.it", "despar-despar","despar"));


        supermarketService.addNewSupermarket( new Supermarket("conad"));
        supermarketService.addNewSupermarket( new Supermarket("deco"));
        supermarketService.addNewSupermarket( new Supermarket("coop"));
        supermarketService.addNewSupermarket( new Supermarket("despar"));



        shopRepository.save(new Shop(
                "conad",  13.34781686817128,38.11906065501892
        ));

        shopRepository.save(new Shop(
                "conad", 13.338814651303492, 38.10861649947868

        ));

        shopRepository.save(new Shop(
                "conad", 13.344307528812017, 38.131243615519516

        ));

        shopRepository.save(new Shop(
                "conad", 13.329194159033769, 38.14493724540794

        ));

        shopRepository.save(new Shop(
                "conad", 13.364306565766874, 38.14502186329422

        ));

        shopRepository.save(new Shop(
                "deco", 13.348938524107508, 38.119204599012726

        ));

        shopRepository.save(new Shop(
                "deco" , 13.326717580438029, 38.111157771580544

        ));

        shopRepository.save(new Shop(
                "deco" , 13.287611741124737, 38.12642672468614

        ));

        shopRepository.save(new Shop(
                "deco",  13.338215581169198, 38.13868393399541

        ));

        shopRepository.save(new Shop(
                "coop",  13.327915896757844, 38.12518055500223

        ));
        shopRepository.save(new Shop(
                "coop",  13.36010240413907, 38.130885762901386

        ));

        shopRepository.save(new Shop(
                "coop",  13.352588478839639, 38.10239369399031

        ));
        shopRepository.save(new Shop(
                "coop",  13.387826145066006, 38.09797605348673

        ));

        shopRepository.save(new Shop(
                "despar",  13.342378227200042, 38.116509298202736

        ));

        shopRepository.save(new Shop(
                "despar",  13.348558036333708, 38.12501731924669

        ));

        shopRepository.save(new Shop(
                "despar",  13.347528069442571, 38.097328853018496

        ));

        fillConad();
        fillCoop();
        fillDeco();
        fillDespar();

        fillShops();


    }

    private void fillDespar() {
        productRepository.save(new Product(
                "Apple", "Melinda", "Delocious apple",
                "200 kcal", 1L, 0.80, "piece",
                "despar", "https://melinda.it/wp-content/uploads/2019/01/GOLDEN-DOP-bollino1.png"));
    }

    private void fillDeco() {
        productRepository.save(new Product(
                "Apple", "Melinda", "Delocious apple",
                "200 kcal", 1L, 0.80, "piece",
                "deco", "https://melinda.it/wp-content/uploads/2019/01/GOLDEN-DOP-bollino1.png"));
        productRepository.save(new Product(
                "Mayo", "Hellmanns", "Mayo Hellman's REAL 400g",
                "500 kcal", 1L, 1.50, "jar",
                "deco", "https://cdn.shopify.com/s/files/1/0357/1407/2713/products/hellmanns-mayonnaise-400g_800x.png?v=1585900136"));

    }

    private void fillCoop() {
        productRepository.save(new Product(
                "Apple", "Melinda", "Delocious apple",
                "200 kcal", 1L, 0.80, "piece",
                "coop", "https://melinda.it/wp-content/uploads/2019/01/GOLDEN-DOP-bollino1.png"));
        productRepository.save(new Product(
                "Outdoor plant", "Garden Life", "Very green plant",
                "0 kcal", 5L, 10, "piece",
                "coop", "https://www.evergreendirect.co.uk/media/wysiwyg/plants/plants-outdoor.png"));
        productRepository.save(new Product(
                "Fish fingers", "Findus", "Findus Fish fingers 12 fingers 300g",
                "200 kcal", 2L, 4, "piece",
                "coop", "https://www.spesaonlinepescara.it/wp-content/uploads/2018/11/Bastoncini-Capitan-Findus-12x.png"));

    }

    private void fillConad() {
        productRepository.save(new Product(
                "Apple", "Melinda", "Delicious apple",
                "200 kcal", 1L, 0.80, "piece",
                "conad", "https://melinda.it/wp-content/uploads/2019/01/GOLDEN-DOP-bollino1.png"));
        productRepository.save(new Product(
                "Pear", "Melina", "Delicious pear",
                "220 kcal", 1L, 0.40, "piece",
                "conad", "https://lh3.googleusercontent.com/proxy/6j6yOB0johbLC2OzUfu4rI3ARCHhH293Es4DeVACbTUfdjH1j-40E6peuKvK-lP84Dk6xNGx14F0EBAuj0Xgi1uxi8HYTlJH1QpjrL9G9Ssbb_YnDA"));
        productRepository.save(new Product(
                "Chicken Breast", "AIA", "AIA Chicken Breast",
                "300 kcal", 2L, 9, "100g",
                "conad", "https://www.aiafood.com/sites/default/files/styles/scale_1200/public/a4052.png?itok=iELOAE-M"));
        productRepository.save(new Product(
                "Toilet paper", "Better Way", "Useful toilet paper",
                "0 kcal", 3L, 2, "package",
                "conad", "https://cdn.shopify.com/s/files/1/0257/5145/3781/t/8/assets/hero-home.png?v=9824410811785611091"));
        productRepository.save(new Product(
                "AAA battery", "Duracell", "Durable batteries",
                "o kcal", 3L, 4, "package",
                "conad", "https://www.duracell.it/upload/sites/4/2019/12/1013361_rechargeable_rpp-cells_AAA-900mAh_4_primary.png.png"));


    }

    public void fillShops(){
        List<Shop> shops = shopRepository.findAll();
        for(Shop shop : shops){
            List<Product> products = productRepository.findAllBySupermarketName(shop.getSupermarketName());
            for(Product product : products){
                int random_quantity = new Random().nextInt(10);
                ShopProduct toAdd = new ShopProduct(
                        shop.getShopId(), product.getProductName(), product.getProductBrand(), random_quantity
                        );
                shopProductRepository.save(toAdd);

            }
        }
    }

}

