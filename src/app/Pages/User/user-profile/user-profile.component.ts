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
  selectedImage!: File;
  authToken: any;
  base64Image!: string;

  constructor(private route: ActivatedRoute,
              private commonApiService:ApiService,
              public modalService:ModalService){}

  ngOnInit (){
    this.authToken = localStorage.getItem('jwt');
   

    this.route.params.subscribe(params => {
      this.userId = params['id'];
      this.getArticleByUserId(this.userId)
      this.getUserByUserId(this.userId);
    });
  }

  getUserByUserId(userId:any){
    this.commonApiService.getUserByUserId({userId:userId}).subscribe({
      next:(res)=>{
        this.user = res;
        this.getBase64Image();
      }
    })


  }

  getArticleByUserId(userId:any){
    this.commonApiService.getArticleByUserId({userId:userId}).subscribe({
      next:(res)=>{
        this.allArticles = res;
      }
    })
  }
  
  openModal() {
    // this.modalService.openModal();

  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  onUpload(): void {
    if (this.selectedImage) {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        this.commonApiService.postRequestWithToken('user/uploadProfile', { image: base64Image }, this.authToken)
          .subscribe({
            next: (res) => {
              this.getUserByUserId(this.userId)
            }
          });
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }
  

  getBase64Image(): void {
    console.log(this.user.profileImage.data.data.toString('base64'))
    if (this.user && this.user.profileImage && this.user.profileImage.data) {
      try {
        const buffer = this.user.profileImage.data.data;
        this.base64Image = 'data:' + this.user.profileImage.contentType + ';base64,' + buffer.toString('base64');
        console.log(this.base64Image)
      } catch (error) {
        console.error('Error converting buffer to Base64:', error);
      }
    } else {
      console.warn('Profile image data is undefined or invalid.');
    }
  }

}
