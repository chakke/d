import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'n-header-segment',
  templateUrl: 'n-header-segment.html'
})
export class NHeaderSegmentComponent {
  @Input("title") title: string = 'this is title';
  @Input("segments") segments: Array<string> = [];
  @Input("root") root: string = '';
  @Input("bgcolor") bgcolor: string = '';
  @Input("color") color: string = '';

  @Output() segmentIndex = new EventEmitter<number>();

  currentSegment: number = 0;

  constructor(public mNavController: NavController) {
  }

  onClickSegment(index) {
    this.currentSegment = index;
    this.segmentIndex.emit(index);
  }

  onClickClose() {
    if(this.mNavController.canGoBack()){
      this.mNavController.pop();
    }
    else{
      this.mNavController.setRoot(this.root);
    }
  }
}
