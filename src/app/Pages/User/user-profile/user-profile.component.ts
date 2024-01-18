import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modalServices/modal.service';
import { EditorComponent } from '../../Article/editor/editor.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  allArticles: any;
  userId: any;
  user: any;

  constructor(private route: ActivatedRoute,
              private ApiServices:ApiService,
              public modalService:ModalService){}

  ngOnInit (){
    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
   

    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.getArticleByUserId(this.userId)
      this.getUserByUserId(this.userId);
    });
  }

  getUserByUserId(userId:any){
    this.ApiServices.getUserByUserId({userId:userId}).subscribe({
      next:(res)=>{
        this.user = res;
      }
    })


  }

  getArticleByUserId(userId:any){
    this.ApiServices.getArticleByUserId({userId:userId}).subscribe({
      next:(res)=>{
        this.allArticles = res;
      }
    })
  }
  
  openModal() {
    this.modalService.openModal();
  }

}
