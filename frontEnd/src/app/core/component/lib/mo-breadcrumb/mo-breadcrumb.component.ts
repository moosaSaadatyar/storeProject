import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Observable, Subscription, filter } from 'rxjs';
import { Router, NavigationEnd, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DynamicBreadcrumbService } from './mo-breadcrumb.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mo-breadcrumb',
  templateUrl: './mo-breadcrumb.component.html',
  styleUrls: ['./mo-breadcrumb.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    TranslateModule,
  ]
})
export class DynamicBreadcrumbComponent implements OnInit {
  public items$;

  @Input() backButton: boolean = false;

  private previousUrl: string;

  private currentUrl: string;

  private readonly _dynamicBreadcrumbService = inject(DynamicBreadcrumbService)

  private readonly router = inject(Router)

  private readonly location = inject(Location)
  private changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.RouterEvent()
    this._dynamicBreadcrumbService.breadcrumb$.subscribe(item => {
      this.items$ = item
      this.backButton = item?.length > 1;
      this.changeDetectorRef.detectChanges()
    });
  }

  private RouterEvent() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      });
  }

  private backToRegistration() {
    const subscription: Subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.endsWith('registration')) {
          const navigateByUrl = this.router.url.includes('utilization-announcements')
            ? 'dashboard/utilization-announcements'
            : 'dashboard/announcements';

          this.router.navigateByUrl(navigateByUrl).then();
        }
        subscription.unsubscribe();
      });
  }

  goBack() {
    this.location.back();
    this.backToRegistration()
  }
}
