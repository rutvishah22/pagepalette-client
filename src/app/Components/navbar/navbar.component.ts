import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  user: any;
  constructor(
    private router:Router,
    public commonService:CommonService
  ){}


  ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
}
