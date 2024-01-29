import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modalServices/modal.service';
import { EditorComponent } from '../../Article/editor/editor.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
  openedDropdownId: number= 0;
  loginUser: any;
  firstImages: any;
  isProfileEdit: boolean = false;
  description:string= 'lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda asperiores quisquam perferendis ipsum quasi? Facere illum at aspernatur temporibus animi, doloribus dolorum, optio quod molestias cum debitis omnis aut blanditiis!  '
  loading: boolean = true;
  articleLoading: boolean = true;
  editProfileForm!:FormGroup ;
  imagePreview:string = '';
  constructor(private route: ActivatedRoute,
              private commonApiService:ApiService,
              public modalService:ModalService,
              public router:Router,
              private formBuilder:FormBuilder){}

ngOnInit() {
  this.loginUser = JSON.parse(localStorage.getItem('user') || '{}');
  this.authToken = localStorage.getItem('jwt');
              
  this.route.params.subscribe(params => {
  this.userId = params['id'];
  this.getArticleByUserId(this.userId);
  this.getUserByUserId(this.userId)
});
}

  getUserByUserId(userId:any){
    this.commonApiService.postRequest('user/getUserByUserId',{userId:userId}).subscribe({
      next:(res)=>{
        this.user = res;
        // this.getBase64Image();
        this.loading = false;
        
      }
    })
  }


  getArticleByUserId(userId:any){
    this.commonApiService.postRequest('article/articleByUserId',{userId:userId}).subscribe({
      next:(res)=>{
        this.allArticles = res;
        const firstImagesForEachArticle = this.allArticles.map((article:any) => {
          const firstImage = this.getFirstImageFromOps(article.ops);
          return { ...article, firstImage };
        });
        this.firstImages = firstImagesForEachArticle;
        this.articleLoading = false;
      }
    })
  }
  
  getFirstImageFromOps(ops: any[]): string | null {
    for (const op of ops) {
      if (op.insert && op.insert.image) {
        return op.insert.image;
      }
    }
    return null;
  }
  

  updateProfileImage(event: any): void {
    const imageInput = event.target as HTMLInputElement;
  
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        const base64Image = e.target.result;
        this.imagePreview = base64Image;
        this.editProfileForm.patchValue({
          profileImage: base64Image,
        });
      };
      reader.readAsDataURL(imageInput.files[0]);
    }
  }

  editProfile(){
    this.imagePreview = this.user.profileImage;
    this.isProfileEdit = true;
    this.editProfileForm = this.formBuilder.group({
      username: [this.user.username, [Validators.required]],
      profileImage: [this.user.profileImage, [Validators.required]],
      bio: [this.user.bio]
    });
  }
  
  submitEditedProfile(){
    if(this.editProfileForm.invalid){
      this.editProfileForm.markAllAsTouched;
      return;
    }
    const formData = {
      userId:this.loginUser.userId,
      username: this.editProfileForm.get('username')?.value,
      password: this.editProfileForm.get('password')?.value,
      profileImage: this.editProfileForm.get('profileImage')?.value,
      bio: this.editProfileForm.get('bio')?.value,
    };
    this.commonApiService.postRequestWithToken('user/editProfile', formData, this.authToken)
          .subscribe({
            next: (res) => {
              this.getUserByUserId(this.userId)
              this.isProfileEdit = false;
            }
    });
};


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

  openDropdown(id:number){
    if(this.openedDropdownId == id){
      this.openedDropdownId = 0;
      return;
    }
    this.openedDropdownId = id;
  }

  checkUserOfArticle(userIdOfArticle:number): boolean {
    if(userIdOfArticle == this.loginUser.userId){
      return true;
    }
    return false;
  }

  editArticle(article:any){
    localStorage.setItem('articleToEditId',article._id);
    this.router.navigateByUrl('/editor')
  }

  deleteArticle(articleId:number){
    this.commonApiService.postRequest('article/deleteArticle', {id: articleId}).subscribe({
      next:(res) => {
        alert(res.message)
        this.getArticleByUserId(this.userId)
      },
      error:(err) =>{
      }
  });
  }
}
