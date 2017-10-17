import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NavController, ViewController } from 'ionic-angular';

import { NSegmentItem } from '../n-segment/n-segment';

@Component({
  selector: 'n-header-segment',
  templateUrl: 'n-header-segment.html'
})
export class NHeaderSegmentComponent {
  @Input("title") title: string = 'this is title';
  @Input("segments") segments: Array<string> = [];
  @Input("root") root: string = '';
  @Input("bgColor") bgColor: string = '';
  @Input("btmColor") btmColor = '';
  @Input("rgtColor") rgtColor = '';
  @Input("bgimg") bgimg: string = '';
  @Input("color") color: string = '';
  @Input("titleUrl") titleUrl: string = '';
  @Input("currentSegment") currentSegment: number = 0;

  @Output() segmentIndex = new EventEmitter<number>();

  constructor(public mNavController: NavController, public mViewController: ViewController) {
  }

  onClickSegment(index) {
    this.setCurrentSegment(index);
    this.segmentIndex.emit(index);
  }

  setCurrentSegment(index) {
    this.currentSegment = index;
  }

  onClickClose() {
    if (this.mNavController.canGoBack()) {
      this.mNavController.pop({ animate: false });
      console.log("canGoBack");
    }
    else {
      this.mNavController.setRoot(this.root, "", { animate: false });
    }
  }
}
