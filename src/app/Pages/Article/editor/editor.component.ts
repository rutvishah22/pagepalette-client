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

  constructor(private apiService:ApiService,
              private router:Router,
              private ngZone: NgZone
              ){}


  private quill!: Quill;
  content: any;
  viewer:any;
  eventSource!: EventSource;
  words: string[] = [];
  userMessage: string = '';
  chatMessages: any[] = [];
  editor: any;
  ngOnInit() {
    this.viewer = new Quill('#viewer', {
      readOnly: true,
      theme: 'snow'
    });
  }

  submitArticle(){
    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.content = this.quill.getContents();
    const data = {
      content:this.content,
      loginUser:loginUser
    }
    this.apiService.submitArticle(data).subscribe({
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
      // Uncomment for write with AI option

      // Currently has a bug
      
      // const toolbar = this.quill.getModule('toolbar');
      // const customButton = document.createElement('button');
      // customButton.style.width = '100px';
      // customButton.innerHTML = 'Write with AI';
      // customButton.addEventListener('click', () => {
      //   // Handle the custom button click
      //   this.showInput =  !this.showInput;
      // });

      // toolbar.container.appendChild(customButton);

      // this.quill.clipboard.dangerouslyPasteHTML(this.quillContent);
    }
  }
 
  click(){
    console.log(this.chatMessages[1].content)
  }
  
  sendMessage() {

    this.showInput = false;
    // console.log('\n');
    const payload = { message: this.userMessage };
    
    // Push the user's message to chatMessages
    this.chatMessages.push({
      role: 'user',
      time: this.getCurrentTime(),
      content: this.userMessage
    });
    
    // Construct the EventSource URL with query parameters
    const eventSourceUrl = `http://localhost:5000/get_chat_completion?payload=${encodeURIComponent(JSON.stringify(payload))}`;
    this.eventSource = new EventSource(eventSourceUrl);

    let assistantMessage = {
        role: 'assistant',
        time: this.getCurrentTime(),
        content: ''
    };

    // Push the initial assistant message to chatMessages
    this.chatMessages.push({ ...assistantMessage });

    this.eventSource.onmessage = (event) => {
      this.ngZone.run(() => {
        console.log(event.data);
        const newContent: string = event.data.trim();
        const newLines: string[] = newContent.split('\n');
    
        for (const line of newLines) {
          const newWords: string[] = line.split(' ');
    
          for (let i = 0; i < newWords.length; i++) {
            const newWord = newWords[i];
            if (newWord === '' || newWord === '\n') {
              assistantMessage.content += '<br>';
            } else if (this.isNumeric(newWord)) {
              assistantMessage.content += '<br>';
              assistantMessage.content += newWord + ' ';
              if (newWord.endsWith(':')) {
                assistantMessage.content += '<br>';
              }
            } else {
              assistantMessage.content += newWord + ' ';
            }
    
            // Add a space between words, excluding the last word in the line
            if (i < newWords.length - 1) {
              assistantMessage.content += ' ';
            }
          }
    
          // Add a line break between each original line, excluding the last line
          if (line !== newLines[newLines.length - 1]) {
            assistantMessage.content += '<br>';
          }
          // Update the entire Quill content
          this.quill.clipboard.dangerouslyPasteHTML(assistantMessage.content);
        }
    
    
        // Update the existing message in chatMessages
        const lastAssistantIndex = this.chatMessages.length - 1;
        if (lastAssistantIndex >= 0) {
          this.chatMessages[lastAssistantIndex].content = assistantMessage.content;
        }
      });
    };
  

    this.eventSource.onerror = (error) => {
        this.ngZone.run(() => {
            console.error('Error in SSE connection:', error);
            this.eventSource.close();
        });
    };

    this.userMessage = ''
}
  
  
isNumeric(char: string): boolean {
  return /^-?\d*\d*$/.test(char);
}
  

  getCurrentTime(): string {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return currentTime;
  }



  editMessage(){

  }
}





// onSubmit(event: Event, messageContent: string) {
//   this.userMessage = ''
  
//   event.preventDefault();

//   const userChatEntry = {
//     role: 'user',
//     content: messageContent,
//     time: this.getCurrentTime()
//   };

//   this.chatMessages.push(userChatEntry);

//   const thinkingMessage = {
//     role: 'assistant',
//     content: 'GPT is Thinking...',
//     time: this.getCurrentTime()
//   };

//   this.chatMessages.push(thinkingMessage);

//   const request = {
//     content: messageContent
//   };

//   this.commonApiService.postRequest('/get_chat_completion', request).subscribe(response => {
   
//     this.chatMessages.pop();

//     const assistantChatEntry = {
//       role: 'assistant',
//       content: response.message,
//       time: this.getCurrentTime()
//     };

//     this.chatMessages.push(assistantChatEntry);
  


