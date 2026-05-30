import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, merge, Observable } from 'rxjs';
import { IMoBreadcrumb } from './mo-breadcrumb.interface';
import { TranslateService } from '@ngx-translate/core';


@Injectable(
  {
    providedIn: 'root'
  }
)
export class DynamicBreadcrumbService {

  private initialBreadCrumb$!: BehaviorSubject<IMoBreadcrumb[]>;
  private _route = inject(ActivatedRoute)
  private _router = inject(Router)
  private translate = inject(TranslateService)
  constructor() {
    this.convertActivatedRoutesToIDynamicBreadcrumbs.bind(this);
    this.initialBreadCrumb$Init();
  }

  private initialBreadCrumb$Init(): void {
    let items = this.convertActivatedRoutesToIDynamicBreadcrumbs(this.getTreeRoutes(this._route));
    this.initialBreadCrumb$ = new BehaviorSubject(items);
    this.initialBreadCrumb$.next(this.convertActivatedRoutesToIDynamicBreadcrumbs(this.getTreeRoutes(this._route)))
  }

  get breadcrumb$(): Observable<IMoBreadcrumb[]> {
    return merge(
      this._router.events.pipe(
        filter(
          (event) => event instanceof NavigationEnd),
        map(() => this._route),
        map((val) => this.getTreeRoutes(val)),
        map((val) => this.convertActivatedRoutesToIDynamicBreadcrumbs(val)),
      ),
      this.initialBreadCrumb$
    )
  }

  private getTreeRoutes(route: ActivatedRoute): ActivatedRoute[] {
    let itemTitle = route?.snapshot?.data?.['breadcrumb'];

    const breadcrumbList: ActivatedRoute[] = [];

    if (itemTitle) {
      breadcrumbList.push(route);
    }
    while (route.firstChild) {
      route = route.firstChild;
      itemTitle = route?.snapshot?.data?.['breadcrumb'];
      if (itemTitle) {
        breadcrumbList.push(route);
      }
    }

    return breadcrumbList;
  }

  private convertActivatedRoutesToIDynamicBreadcrumbs(routesList: ActivatedRoute[]): IMoBreadcrumb[] {
    let breadcrumbs: IMoBreadcrumb[] = [];
    routesList.forEach(
      (item) => {
        const canClick = item?.snapshot?.data?.['canClick'] !== undefined ? item?.snapshot?.data?.['canClick'] : true;
        breadcrumbs.push(
          {
            path: item.snapshot.pathFromRoot
              .reduce(
                (acc, curr) => {
                  curr.url.forEach(
                    (val) => acc += val + '/'
                  );
                  return acc;
                },
                '/'
              ),
            titleItem: item.snapshot.data?.['breadcrumb'] ?? '',
            canClick: canClick
          }
        );
      }
    );
    return this.removeRepetitiveBreadCrumbs(breadcrumbs);
  }

  private removeRepetitiveBreadCrumbs(breadcrumbs: IMoBreadcrumb[]): IMoBreadcrumb[] {
    return breadcrumbs.reduce(
      (acc: IMoBreadcrumb[], curr) => {
        let exists = acc.find(
          (item) => {
            return item.path === curr.path && item.titleItem === curr.titleItem;
          }
        );
        if (!exists) {
          acc = acc.concat(curr);
        }
        return acc;
      },
      []
    );

  }

}
