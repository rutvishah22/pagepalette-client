import { Component } from '@angular/core';
import { ModalService } from 'src/app/services/modalServices/modal.service';

@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.scss']
})
export class MyModalComponent {
  constructor(public modalService:ModalService){}
  closeModal(){
    console.log("heyy")
   this.modalService.closeModal();
  }
}
