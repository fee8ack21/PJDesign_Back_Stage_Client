import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailBaseComponent } from 'src/app/shared/components/base/detail-base.component';

@Component({
  selector: 'app-administrator-detail',
  templateUrl: './administrator-detail.component.html',
  styleUrls: ['./administrator-detail.component.scss']
})
export class AdministratorDetailComponent extends DetailBaseComponent implements OnInit {
  constructor(protected route: ActivatedRoute) {
    super(route);
  }

  ngOnInit(): void {
    this.setPageStatus();
  }
}
