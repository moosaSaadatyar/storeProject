import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class Unsubscriber implements OnDestroy
{
  private _subscription: Subscription = new Subscription();
  protected destroy$: Subject<void> = new Subject<void>();

  ngOnDestroy(): void
  {
    this.destroy$.next();
    this.destroy$.complete();
    this.resetSubscriptions();
  }

  protected resetSubscriptions():void
  {
    this._subscription.unsubscribe();
    this._subscription = new Subscription();
  }

  set   anotherSubscription(sub: Subscription)
  {
    this._subscription.add(sub);
  }

}
