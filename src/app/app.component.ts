import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  eventSource!: EventSource;
  words: string[] = [];
  userMessage: string = '';
  chatMessages: any[] = [];

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    
  }
  

  ngOnDestroy() {
    this.eventSource.close();
  }

  sendMessage() {
    // console.log('\n');
    const payload = { message: this.userMessage };
    
    // Push the user's message to chatMessages
    this.chatMessages.push({
      role: 'user',
      content: this.userMessage
    });
    
    // Construct the EventSource URL with query parameters
    const eventSourceUrl = `http://localhost:5000/get_chat_completion?payload=${encodeURIComponent(JSON.stringify(payload))}`;
    // const eventSourceUrl = http://localhost:5000/get_chat_completion?payload=${encodeURIComponent(JSON.stringify(payload))};
    this.eventSource = new EventSource(eventSourceUrl);

    let assistantMessage = {
        role: 'assistant',
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
                  if (newWord === '\n') {
                      assistantMessage.content += '<br>';
                  } 
                  else if (this.isNumeric(newWord)) {
                      assistantMessage.content += newWord + ' ';
                      assistantMessage.content += '<br>';
                      
                  }
                  else if (newWord.endsWith(':')) {
                    assistantMessage.content += newWord + '<br>';
                  }
                 else {
                      assistantMessage.content += newWord + ' ';
                  }
  
                  // Add a line break between words only if not the last word in the line
                  // if (i < newWords.length - 1) {
                  //     assistantMessage.content += '<br>';
                  // }
              }
  
              // Add a line break between each original line, excluding the last line
              if (line !== newLines[newLines.length - 1]) {
                  assistantMessage.content += '<br>';
              }
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
  return /^\d*\d*$/.test(char);
}

  getText(text:any){
    return text.replace(/\n/g,'<br>')

  }
}

