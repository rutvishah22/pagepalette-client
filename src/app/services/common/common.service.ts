import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  currentTheme = 'dark';

  getCurrentTheme(){
    return this.currentTheme;
  }

  setTheme(themeName:string){
    this.currentTheme = themeName;
  }

  setCurrentTheme(themeName:string){
    this.currentTheme = themeName;
  }
}
