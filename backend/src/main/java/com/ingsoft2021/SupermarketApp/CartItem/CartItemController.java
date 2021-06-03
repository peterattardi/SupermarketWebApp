package com.ingsoft2021.SupermarketApp.CartItem;
import com.ingsoft2021.SupermarketApp.auth.login.Login;
import com.ingsoft2021.SupermarketApp.auth.login.LoginService;
import com.ingsoft2021.SupermarketApp.util.Checker;
import com.ingsoft2021.SupermarketApp.util.Request.CartItemDeleteRequest;
import com.ingsoft2021.SupermarketApp.util.Request.CartItemRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@AllArgsConstructor
public class CartItemController {
    private final CartItemService cartItemService;
    private final LoginService loginService;

    @PutMapping("user/cart/update")
    public ResponseEntity addCartItem(@RequestParam String token, @RequestBody CartItemRequest cartItem){
        try {
            Checker.check(cartItem);
            Login login = loginService.findByToken(token);
            String role = login.getAppUserRole().name();
            CartItem toAdd = new CartItem(cartItem, login.getEmail());
            switch (role) {
                case ("USER"):
                    cartItemService.addCartItem(toAdd);
                    return ResponseEntity.status(200).body("SUCCESS");
                case ("GUEST"):
                    toAdd.setExpiresAt(login.getExpiresAt());
                    cartItemService.addCartItem(toAdd);
                    return ResponseEntity.status(200).body("SUCCESS");
                default:
                    throw new IllegalStateException("APPUSEROLE_NOT_VALID");
            }
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @DeleteMapping("user/cart/delete")
    public ResponseEntity deleteCartItem(@RequestParam String token, @RequestBody CartItemDeleteRequest cartItemDeleteRequest){
        try {
            loginService.findByToken(token);
            cartItemService.deleteCartItem(cartItemDeleteRequest);
            return ResponseEntity.status(200).body("SUCCESS");
        }catch (IllegalStateException | NoSuchFieldException e){
            return ResponseEntity.status(400).body(e.getMessage());
        }

    }


}
