import { Injectable, OnDestroy, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/** تنظیمات سئوی هر صفحه */
export interface SeoConfig {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}

/**
 * سرویس سئو — مدیریت title، meta description، canonical، Open Graph، Twitter Card،
 * هدر robots و داده ساختاریافته (JSON-LD) در سطح کل سایت.
 *
 * - برای صفحات ثابت: `data.seo` روی روت (app.routes.ts) — خودکار اعمال می‌شود.
 * - برای صفحات پویا (مثلاً جزئیات پروژه): بعد از بارگذاری داده، `apply()` را صدا بزنید.
 */
@Injectable({ providedIn: 'root' })
export class SeoService implements OnDestroy {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);

  private readonly subscription = this.router.events
    .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
    .subscribe(() => this.applyFromRoute());

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /** URL فعلی بدون query و اسلاش انتهایی (برای canonical و og:url) */
  private cleanUrl(): string {
    const { origin, pathname } = window.location;
    const path = pathname.replace(/\/+$/, '');
    return origin + (path === '' ? '/' : path);
  }

  /** اعمال تنظیمات سئوی یک صفحه */
  apply(config: SeoConfig): void {
    this.titleService.setTitle(config.title);
    const description = config.description || '';
    const url = this.cleanUrl();

    this.upsertMeta('name', 'description', description);
    this.upsertMeta('name', 'robots', config.noindex ? 'noindex, nofollow' : 'index, follow');
    this.upsertMeta('property', 'og:title', config.title);
    this.upsertMeta('property', 'og:description', description);
    this.upsertMeta('property', 'og:url', url);
    this.upsertMeta('name', 'twitter:title', config.title);
    this.upsertMeta('name', 'twitter:description', description);
    if (config.image) {
      const img = this.absolute(config.image);
      this.upsertMeta('property', 'og:image', img);
      this.upsertMeta('name', 'twitter:image', img);
    }
    this.upsertLink('canonical', url);
  }

  /** خواندن `data.seo` از مسیر فعال (عمیق‌ترین روت برتر) و اعمال آن */
  applyFromRoute(): void {
    let node: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (node.firstChild) {
      node = node.firstChild;
    }
    let cursor: ActivatedRouteSnapshot | null = node;
    while (cursor) {
      const seo = cursor.data['seo'] as SeoConfig | undefined;
      if (seo) {
        this.apply(seo);
        return;
      }
      cursor = cursor.parent;
    }
  }

  /** درج یا جایگزینی یک بلوک JSON-LD — اگر data خالی باشد، بلوک حذف می‌شود */
  setJsonLd(id: string, data: unknown): void {
    document.querySelector(`script#seo-ld-${id}`)?.remove();
    if (!data) {
      return;
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `seo-ld-${id}`;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  /** تبدیل مسیر نسبی به URL مطلق */
  private absolute(url: string): string {
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) {
      return url;
    }
    return url.startsWith('/') ? window.location.origin + url : `${window.location.origin}/${url}`;
  }

  private upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string): void {
    const tag = this.meta.getTag(`${attrName}="${attrValue}"`);
    if (tag) {
      tag.content = content;
    } else {
      this.meta.addTag({ [attrName]: attrValue, content });
    }
  }

  private upsertLink(rel: string, href: string): void {
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = href;
  }
}
