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

@Component({
  selector: 'app-choose-market',
  templateUrl: './choose-market.component.html',
  styleUrls: ['./choose-market.component.css']
})
export class ChooseMarketComponent implements OnInit {
  supermarkets: Shop[];
  position: Position = null;
  supermarketsObs: Observable<Shop[]>;
  chosenMarket: Supermarket = null;
  isLoading = false;
  error: string = null;

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

  constructor(
    private authService: AuthService,
    private marketService: MarketService,
    private router: Router,
    private readonly geolocation$: GeolocationService,
    private shopService: ShopService,
    private positionService: PositionService) { }

  ngOnInit(): void {
    // debugger;
    if (localStorage.getItem('supermarket') || this.authService.isAdmin()) {
      if (!localStorage.getItem('supermarket')) {
        this.authService.setAdminSupermarket();
      }
      this.router.navigate(['/management']);
    }
    this.checkPosition();
  }

  checkPosition(): void {
    const prevPos = JSON.parse(localStorage.getItem('position'));
    if (prevPos) {
      this.position = new Position(prevPos.latitude, prevPos.longitude);
      this.getMarkets();
    } else {
      this.geolocation$.pipe(take(1)).subscribe(
        position => {
          this.position = new Position(position.coords.latitude, position.coords.longitude);
          this.getMarkets();
        }
      );
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
        this.error = errorMessage;
      });
  }


  initGoogleMap(): void {
    this.loader.load().then(() => {
      // @ts-ignore
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: this.position.latitude, lng: this.position.longitude },
        zoom: 13,
      });
      // @ts-ignore
      this.infoWindow = new google.maps.InfoWindow();

      // @ts-ignore
      this.marker = new google.maps.Marker({
        position: { lat: this.position.latitude, lng: this.position.longitude },
        map: this.map,
        title: 'Current Position'
      });

      // @ts-ignore
      google.maps.event.addListener(this.map, 'click', (event) => {
        this.updateMarker(event.latLng);
        this.position = new Position(event.latLng.lat(), event.latLng.lng());
        this.getMarkets();
      });

      debugger;
      this.supermarkets.forEach (
        shop => {
          this.setShop(shop);
        }
      );
    });
  }

  // Adds a marker to the map.
  // @ts-ignore
  updateMarker(location: google.maps.LatLngLiteral): void {
    this.marker.setMap(null);
    this.marker = null;
    // @ts-ignore
    this.marker = new google.maps.Marker({
      position: location,
      title: 'Current Position',
      map: this.map
    });
    this.map.setCenter(location);
  }

  setShop(shop: Shop): void {
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
    const iconImg = new Image();
    iconImg.src = icon;
    iconImg.height = 5;
    iconImg.width = 5;
    const title = shop.supermarketName.charAt(0).toUpperCase() + shop.supermarketName.substr(1);
    // @ts-ignore
    const shopMarker = new google.maps.Marker({
      position: {lat: shop.latitude, lng: shop.longitude},
      title: shop.shopId + '. ' + title,
      icon,
      map: this.map
    });

    shopMarker.addListener('mouseover', () => {
      this.infoWindow.close();
      this.infoWindow.setContent(shopMarker.getTitle());
      this.infoWindow.open(this.map, shopMarker);
    });
    shopMarker.addListener('mouseout', () => {
      this.infoWindow.close();
    });

    this.shopMarkers.push(shopMarker);
  }

  getCurrentPosition(): void {
    this.geolocation$.pipe(take(1)).subscribe(
      position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.updateMarker({lat, lng});
        this.position = new Position(lat, lng);
        // @ts-ignore
        this.getMarkets();
      }
    );
  }

  onGetPositionByAddress(address: string): void {
    if (!address) { return; }
    this.positionService.getPositionByAddress(address).subscribe(
      (position: Position) => {
        this.position = position;
        this.updateMarker({lat: position.latitude, lng: position.longitude});
        this.getMarkets();
      }
    );
  }

  onClearError(): void {
    this.error = null;
  }

  onSelect(shop: Shop): void {
    this.chosenMarket =  new Supermarket(shop.supermarketName);
    this.shopMarkers.forEach( shopMarker => {
      shopMarker.setMap(null);
    });
    this.shopMarkers = [];
    this.setShop(shop);
  }

  onChooseSupermarket(): void {
    this.marketService.chooseSupermarket(this.chosenMarket, this.position);
    this.router.navigate(['/auth/login']);
  }

}
