package com.ingsoft2021.SupermarketApp.appuser;


import org.springframework.web.bind.annotation.*;



@RestController
@CrossOrigin(origins = "http://localhost:4200/")
public class AppUserController {


    //TODO: getCatalogue()

    /*TODO: modelling logging as a guest:
    edit login table so that token is now the key.
    edit AppUserRole so that GUEST is an app user role.

    guestRequest{
        "longitude": "111",
        "latitude" : "111"
    }

    appUserController(GuestRequest guestRequest){
        loginService.loginAsGuest(guestRequest)
    }

    loginAsGuest(GuestRequest guestRequest){
        token = new Token()
        login = new Login(null,token,AppUSerRole.GUEST, LocalDateTime.now(),
         LocalDateTime.now().plushHours(2));
    }

   */
}
