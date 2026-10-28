import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ProjectService } from '../../services/project.service';
import { ProjectCard } from '../../dynamics/project-card/project-card';
import { IProject } from '../../../core/interface/project.interface';

/**
 * سکشن پروژه‌های منتخب در صفحه خانه
 */
@Component({
  selector: 'app-featured-projects',
  imports: [CommonModule, TranslateModule, SkeletonModule, ProjectCard],
  templateUrl: './featured-projects.component.html',
  styleUrl: './featured-projects.component.css',
})
export class FeaturedProjectsComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  projects: IProject[] = [];
  loading = true;

  ngOnInit(): void {
    this.projectService.list({ featured: true, limit: 3 }).subscribe({
      next: (data) => {
        this.projects = data?.items || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
