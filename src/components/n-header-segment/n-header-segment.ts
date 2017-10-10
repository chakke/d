import { Component, Input, Output, EventEmitter } from '@angular/core';

import { NavController } from 'ionic-angular';

import { NSegmentItem } from '../n-segment/n-segment';

@Component({
  selector: 'n-header-segment',
  templateUrl: 'n-header-segment.html'
})
export class NHeaderSegmentComponent {
  @Input("title") title: string = 'this is title';
  @Input("segments") segments: Array<string> = [];
  @Input("root") root: string = '';
  @Input("bgcolor") bgcolor: string = '';
  @Input("btmColor") btmColor = '';
  @Input("rgtColor") rgtColor = '';
  @Input("bgimg") bgimg: string = '';
  @Input("color") color: string = '';
  @Input("titleUrl") titleUrl: string = '';
  @Input("currentSegment") currentSegment: number = 0;

  @Output() segmentIndex = new EventEmitter<number>();


  // @Input("segments") segments: Array<NSegmentItem> = [];
  // @Input("bottomColor") btmColor: string = '';
  // @Input("rightColor") rgtColor: string = '';

  constructor(public mNavController: NavController) {
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
    }
    else {
      this.mNavController.setRoot(this.root, "", { animate: false });
    }
  }
}
