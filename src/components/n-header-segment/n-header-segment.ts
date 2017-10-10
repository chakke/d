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
  @Input("titleUrl") titleUrl: string = '';
  @Input("currentSegment") currentSegment: number = 0;

  @Output() segmentIndex = new EventEmitter<number>();

  constructor(public mNavController: NavController) {
  }

  onClickSegment(index) {
    this.setCurrentSegment(index);
    this.segmentIndex.emit(index);
  }

  setCurrentSegment(index){
    this.currentSegment = index;
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
