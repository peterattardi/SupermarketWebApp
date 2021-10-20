import { Component, OnInit } from '@angular/core';
import {MarketService, Position, Supermarket} from '../../shared/market.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Shop, ShopService} from '../../shared/shop.service';
import {AdminProductsService} from '../admin-products.service';
import { Loader } from '@googlemaps/js-api-loader';
import {environment} from '../../../environments/environment';
import {take} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-choose-shop',
  templateUrl: './choose-shop.component.html'
})
export class ChooseShopComponent implements OnInit {
  shops: Shop[];
  shopsObs: Observable<Shop[]>;
  chosenShop: Shop = null;
  isLoading = false;

  // MAPS VARIABLES
  loader = new Loader({
    apiKey: environment.GOOGLE_API_KEY,
    version: 'weekly'
  });
  // @ts-ignore
  marker: google.maps.Marker;
  // @ts-ignore
  map: google.maps.Map;
  // @ts-ignore
  infoWindow: google.maps.InfoWindow;
  // @ts-ignore
  shopMarkers: {marker: google.maps.Marker, shop: Shop}[] = [];
  PALERMO_BOUNDS = {
    north: 38.24,
    south: 38.01,
    west: 13.20,
    east: 13.55,
  };

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private shopService: ShopService,
    private adminProductsService: AdminProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getShops();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  getShops(): void {
    this.isLoading = true;
    this.shopsObs = this.shopService.getShops()
      .pipe(take(1));
    this.shopsObs.subscribe(
      shops => {
        this.shops = shops;
        this.initGoogleMap();
        this.isLoading = false;
      },
      errorMessage => {
        this.isLoading = false;
        if (errorMessage === 'Session expired') {
          this.authService.logout();
        }
        this.openSnackBar(errorMessage, 'Ok');
      });
  }

  initGoogleMap(): void {
    this.loader.load().then(() => {
      // @ts-ignore
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: this.shops[0].latitude, lng: this.shops[0].longitude },
        zoom: 13,
        restriction: {
          latLngBounds: this.PALERMO_BOUNDS,
          strictBounds: false,
        },
      });
      // @ts-ignore
      this.infoWindow = new google.maps.InfoWindow();

      this.shops.forEach (
        shop => {
          this.setShop(shop);
        }
      );
    });
  }

  setShop(shop: Shop, setCenter: boolean = false): void {
    let icon: string = null;
    if (shop.supermarketName === 'conad') {
      icon = 'https://www.conad.it/etc/designs/conad_main/clientlib-css/img/logo-simple.png';
      icon = 'https://i.imgur.com/3lVecZO.png';
    } else if (shop.supermarketName === 'deco') {
      icon = 'https://upload.wikimedia.org/wikipedia/it/0/0f/Dec%C3%B2_logo.png';
      icon = 'https://i.imgur.com/K72F6jM.png';
    } else if (shop.supermarketName === 'coop') {
      icon = 'https://comunica-re.it/wp-content/uploads/2017/07/coop-logo-300x171.png';
      icon = 'https://i.imgur.com/FATBDV8.png';
    } else if (shop.supermarketName === 'despar') {
      icon = 'https://www.desparmessina.it/template/default/condivisi/grafica/logo_FB.png';
      icon = 'https://i.imgur.com/A1ecxc7.png';
    }
    const location = {lat: shop.latitude, lng: shop.longitude};
    const iconImg = new Image();
    iconImg.src = icon;
    iconImg.height = 5;
    iconImg.width = 5;
    const title = shop.supermarketName.charAt(0).toUpperCase() + shop.supermarketName.substr(1);
    // @ts-ignore
    const shopMarker = new google.maps.Marker({
      position: location,
      title: shop.shopId + '. ' + title,
      icon,
      map: this.map,
      // @ts-ignore
      animation: google.maps.Animation.BOUNCE
    });

    shopMarker.addListener('mouseover', () => {
      this.infoWindow.close();
      this.infoWindow.setContent(shopMarker.getTitle());
      this.infoWindow.open(this.map, shopMarker);
    });
    shopMarker.addListener('mouseout', () => {
      this.infoWindow.close();
    });
    shopMarker.addListener('click', () => {
      this.onSelect(shop);
    });

    this.shopMarkers.push({marker: shopMarker, shop});
    if (setCenter) {
      this.map.setCenter(location);
    }
    setTimeout( () => {
      shopMarker.setAnimation(null);
    }, 500);
  }

  onReloadShops(): void {
    this.getShops();
  }

  onSelect(shop: Shop): void {
    // @ts-ignore
    let marker: google.maps.Marker;
    this.shopMarkers.forEach(
      (shopMarker) => {
        if (shopMarker.shop.shopId === shop.shopId) {
          marker = shopMarker.marker;
        }
      }
    );
    this.chosenShop = shop;
    this.map.setCenter({lat: shop.latitude, lng: shop.longitude});
    this.map.setZoom(13);
    // @ts-ignore
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout( () => {
      marker.setAnimation(null);
    }, 1000);
  }

  onChooseShop(): void {
    this.shopService.chooseShop(this.chosenShop);
    this.adminProductsService.setShop(
      this.chosenShop.shopId,
      this.chosenShop.latitude,
      this.chosenShop.longitude,
      this.chosenShop.supermarketName);
    this.router.navigate([this.chosenShop.shopId], {relativeTo: this.route});
  }
}
