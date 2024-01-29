import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Quill from 'quill';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent {
  articleId: String = " ";
  viewer:any;
  userName: any;
  isDropdownVisible: boolean = false;
  article: any;

  constructor(
    private route: ActivatedRoute,
    private apiServices:ApiService,
    public router: Router,
    private commonApiService:ApiService
    ) { }

  ngOnInit(): void {
    this.viewer = new Quill('#viewer', {
      readOnly: true,
      theme: 'snow',
      modules: {
              toolbar: false
            }
    });

    this.route.params.subscribe(params => {
      this.articleId = params['id'];
      this.getArticle(this.articleId);
    });
  }

  getArticle(id:any){
      this.apiServices.postRequest('article/getArticleById', {"id":id}).subscribe((article)=>{
        this.viewer.setContents(article.ops)
        this.article = article
      })
  }

  toggleDropdown(): void {
     this.isDropdownVisible = !this.isDropdownVisible;
  }

  editArticle(articleId:any){
    localStorage.setItem('articleToEditId',articleId);
    this.router.navigateByUrl('/editor')
  }

  deleteArticle(articleId:number){
    this.commonApiService.postRequest('article/deleteArticle', {id: articleId}).subscribe({
      next:(res) => {
        alert(res.message)
        this.getArticle(this.articleId);
      }
  });
  }
}

