import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  allArticles: any;
  allUsers: any;
  firstImages: any;
  isDropdownVisible: boolean = false;
  openedDropdownId: any;
  loginUser:any;

  constructor(
    private commonApiService:ApiService,
    private router:Router,
    ){}

  ngOnInit (){
    this.loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    if(this.loginUser.userId){
      this.getArticles()
      // this.getUsers()
    }else{
      this.router.navigate(['/login']);
    }

  }

  getArticles(): void {
    this.commonApiService.getAllArticles(this.loginUser).subscribe({
      next: (res) => {
        this.allArticles = res;

        const firstImagesForEachArticle = this.allArticles.map((article:any) => {
          const firstImage = this.getFirstImageFromOps(article.ops);
          return { ...article, firstImage };
        });

        this.firstImages = firstImagesForEachArticle; 
      }
    });
  }

  getFirstImageFromOps(ops: any[]): string | null {
    for (const op of ops) {
      if (op.insert && op.insert.image) {
        return op.insert.image;
      }
    }
    return null; // No image found
  }


// Iterate through all articles and get the first image for each


  getUsers(){
    this.commonApiService.getUsers().subscribe({
      next:(res)=>{
        this.allUsers = res;
      }
    })
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

  deleteArticle(articleId:number){
    this.commonApiService.postRequest('article/deleteArticle', {id: articleId}).subscribe({
      next:(res) => {
        alert(res.message)
        this.getArticles();
      }
  });
  }

  editArticle(article:any){
    localStorage.setItem('articleToEditId',article._id);
    this.router.navigateByUrl('/editor')
  }

  likeArticle(article:any){
    if(article.isLiked == true){
      article.isLiked = false;
    }else{
      article.isLiked = true;
    }
    this.commonApiService.postRequest('article/likeArticle', {articleId: article._id}).subscribe((res:any)=>{
      
    })
  }
}
