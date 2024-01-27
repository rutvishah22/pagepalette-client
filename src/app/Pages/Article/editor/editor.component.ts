import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Quill from 'quill';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit,AfterViewInit  {

  @ViewChild('editor', { static: true }) editorElement!: ElementRef;
  showInput: boolean = false;
  articleToEditId: any;
  loading: boolean = false;
  private quill!: Quill;
  content: any;
  viewer:any;
  eventSource!: EventSource;
  editor: any;

  constructor(private commonApiService:ApiService,
              private router:Router,
              private ngZone: NgZone
              ){}
  ngOnInit() {
    this.viewer = new Quill('#viewer', {
      readOnly: true,
      theme: 'snow'
    });
    
    this.articleToEditId = localStorage.getItem('articleToEditId') || ''
    if(this.articleToEditId !== ''){
      this.getArticle(this.articleToEditId)
    }
    
  }

  submitArticle(){
    if(this.articleToEditId !== ''){
      const content = this.quill.getContents().ops;
      this.commonApiService.postRequest('article/updateArticle',{articleId:this.articleToEditId,content}).subscribe({
        next:(res)=>{
          alert(res.message);
          localStorage.removeItem('articleToEditId');
          this.router.navigateByUrl('/');
        }
      });
      
      return;
    }
    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.content = this.quill.getContents();
    const data = {
      content:this.content,
      loginUser:loginUser
    }
    this.commonApiService.submitArticle(data).subscribe({
      next:(response)=>{
        alert('Your article has been uploaded');
        this.router.navigate(['/'])
      }
    })
  }

  ngAfterViewInit() {
    if (this.editorElement && this.editorElement.nativeElement) {
      this.quill = new Quill(this.editorElement.nativeElement, {
        theme: 'snow',
        placeholder: 'Write something...',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['link', 'image'],
              ['clean'],
            ],
            handlers: {
              
            }
          },
        },
      });
    }
  }

  getArticle(id:any){
    this.loading = true;
    this.commonApiService.postRequest('article/getArticleById', {"id":id}).subscribe((article)=>{
      this.quill.setContents(article.ops);
      this.loading = false;
    })
  }
}
