import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component(
  {
    selector: 'rah-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css'],
    standalone:true,
    imports:[CommonModule]
  }
)
export class LoadingComponent implements OnInit
{

  @Input()
  public showLoading = true;

  @Input()
  public loaderSize: 'sm' | 'md' | 'lg' = 'md'

  public wrapperClasses: Record<string, boolean>;


  public ngOnInit(): void
  {
    this.wrapperClasses =
      {
        "cmp-wrapper": true,
        "cmp-wrapper-sm": this.loaderSize=== "sm",
        "cmp-wrapper-md": this.loaderSize=== "md",
        "cmp-wrapper-lg": this.loaderSize=== "lg"
      }
  }

}
