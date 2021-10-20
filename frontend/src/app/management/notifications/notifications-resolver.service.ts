import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {NotificationsService} from './notifications.service';

@Injectable({ providedIn: 'root' })
export class NotificationsResolver implements Resolve<number> {
  constructor(
    private notificationsService: NotificationsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.notificationsService.getNotifications();
    return 1;
  }
}
