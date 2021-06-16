import {Component, OnInit} from '@angular/core';
import {MarketService} from '../../shared/market.service';
import {Supermarket, Position} from '../../shared/market.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';
import { Loader } from '@googlemaps/js-api-loader';
import {environment} from '../../../environments/environment';
import {PositionService} from '../../shared/position.service';
import {GeolocationService} from '@ng-web-apis/geolocation';
import {take} from 'rxjs/operators';
import {Shop, ShopService} from '../../shared/shop.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-choose-market',
  templateUrl: './choose-market.component.html',
  styleUrls: ['./choose-market.component.css']
})
export class ChooseMarketComponent implements OnInit {
  position: Position = null;
  supermarkets: Shop[];
  supermarketsObs: Observable<Shop[]>;
  chosenMarket: Supermarket = null;

  isLoading = false;
  isGeolocation = true;

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
  shopMarkers: google.maps.Marker[] = [];
  // @ts-ignore
  positionCircle: google.maps.Circle;
  PALERMO_BOUNDS = {
    north: 38.24,
    south: 38.01,
    west: 13.20,
    east: 13.55,
  };

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private router: Router,
    private readonly geolocation$: GeolocationService,
    private shopService: ShopService,
    private positionService: PositionService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      if (!localStorage.getItem('supermarket')) {
        this.authService.setAdminSupermarket();
      }
      this.router.navigate(['/management']);
    }
    this.checkPosition();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action);
  }

  checkPosition(): void {
    const prevPos = JSON.parse(localStorage.getItem('position'));
    if (prevPos) {
      this.position = new Position(prevPos.latitude, prevPos.longitude);
      this.getMarkets();
    } else {
      this.getCurrentPosition();
    }
  }

  getMarkets(): void {
    this.chosenMarket = null;
    this.isLoading = true;
    this.supermarketsObs = this.marketService.getSupermarkets(this.position);
    this.supermarketsObs
      .pipe(take(1))
      .subscribe(
      resData => {
        this.supermarkets = resData;
        this.initGoogleMap();
        this.isLoading = false;
      },
      errorMessage => {
        this.isLoading = false;
        this.initGoogleMap(false);
        this.openSnackBar(errorMessage, 'Dismiss');
      });
  }


  initGoogleMap(success: boolean = true): void {
    this.loader.load().then(() => {
      if (!this.map) {
        // @ts-ignore
        this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
          center: { lat: this.position.latitude, lng: this.position.longitude },
          zoom: 13,
          restriction: {
            latLngBounds: this.PALERMO_BOUNDS,
            strictBounds: false,
          },
        });

        // @ts-ignore
        this.infoWindow = new google.maps.InfoWindow();

        // @ts-ignore
        this.updateMarker({ lat: this.position.latitude, lng: this.position.longitude });

        // @ts-ignore
        google.maps.event.addListener(this.map, 'click', (event) => {
          this.updateMarker(event.latLng);
          this.position = new Position(event.latLng.lat(), event.latLng.lng());
          this.getMarkets();
        });
      }

      // Load supermarkets in map only if supermarkets
      if (success) {
        this.clearMarkers();
        this.supermarkets.forEach (
          shop => {
            this.setShop(shop);
          }
        );
      }
    });
  }

  clearMarkers(): void {
    this.shopMarkers.forEach( shopMarker => {
      shopMarker.setMap(null);
    });
    this.shopMarkers = [];
  }

  // Adds a marker to the map.
  // @ts-ignore
  updateMarker(location: google.maps.LatLngLiteral): void {
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
      this.map.setCenter(location);
      this.positionCircle.setMap(null);
    }
    // @ts-ignore
    this.marker = new google.maps.Marker({
      position: location,
      title: 'Current Position',
      map: this.map
    });
    // @ts-ignore
    this.positionCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.4,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.16,
      map: this.map,
      center: location,
      radius: 4000,
    });

    this.positionCircle.addListener('click', (event) => {
      this.updateMarker(event.latLng);
      this.position = new Position(event.latLng.lat(), event.latLng.lng());
      this.getMarkets();
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
      title,
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

    this.shopMarkers.push(shopMarker);
    if (setCenter) {
      this.map.setCenter(location);
    }
    setTimeout( () => {
      shopMarker.setAnimation(null);
    }, 1000);
  }

  getCurrentPosition(): void {
    if (this.geolocation$) {
      this.geolocation$.pipe(take(1)).subscribe(
        position => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          if (this.map) {
            this.updateMarker({lat, lng});
          }
          this.position = new Position(lat, lng);
          this.getMarkets();
        },
        errorMessage => {
          this.position = new Position(38.13323771447384, 13.34796483716204);
          this.getMarkets();
          this.isGeolocation = false;
          this.openSnackBar(errorMessage.message, 'Dismiss');
        }
      );
    } else {
      this.isGeolocation = false;
      const message = 'Geolocation is not activated';
      this.openSnackBar(message, 'Dismiss');
      this.position = new Position(38.13323771447384, 13.34796483716204);
      this.getMarkets();
    }
  }

  // TODO: When you type something wrong you see the previous supermarkets, if you then type a
  // correct address then you still see the wrong message => make a snackbar instead of the panel
  onGetPositionByAddress(address: string): void {
    if (!address) { return; }
    this.positionService.getPositionByAddress(address + ' palermo').subscribe(
      (position: Position) => {
        if (position) {
          this.position = position;
          this.updateMarker({lat: position.latitude, lng: position.longitude});
          this.getMarkets();
        } else {
          this.openSnackBar('Did not find any place. Please be more precise.', 'Ok');
        }
      },
      errorMessage => {
        this.openSnackBar(errorMessage, 'Dismiss');
      }
    );
  }

  onSelect(shop: Shop): void {
    this.chosenMarket = new Supermarket(shop.supermarketName);
    this.clearMarkers();
    this.setShop(shop, true);
    this.map.setZoom(14);
  }

  onChooseSupermarket(): void {
    this.marketService.chooseSupermarket(this.chosenMarket, this.position);
    if (this.authService.user.value) {
      this.router.navigate(['/catalogue']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

}
