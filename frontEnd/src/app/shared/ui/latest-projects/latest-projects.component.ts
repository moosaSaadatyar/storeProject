import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ProjectService } from '../../services/project.service';
import { ProjectCard } from '../../dynamics/project-card/project-card';
import { IProject } from '../../../core/interface/project.interface';

/**
 * سکشن جدیدترین نمونه‌کارها در صفحه خانه
 */
@Component({
  selector: 'app-latest-projects',
  imports: [CommonModule, RouterLink, TranslateModule, SkeletonModule, ProjectCard],
  templateUrl: './latest-projects.component.html',
  styleUrl: './latest-projects.component.css',
})
export class LatestProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  projects: IProject[] = [];
  loading = true;

  ngOnInit(): void {
    this.projectService.list({ limit: 6 }).subscribe({
      next: (data) => {
        this.projects = data?.items || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
