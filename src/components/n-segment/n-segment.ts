import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'n-segment',
  templateUrl: 'n-segment.html'
})
export class NSegmentComponent {
  @Input("segments") segments: Array<NSegmentItem> = [];
  @Input("bottomColor") btmColor: string = '';
  @Input("rightColor") rgtColor: string = '';
  @Output() segmentIndex = new EventEmitter<number>();

  currentSegment: number = 0;

  constructor() {
  }

  onClickSegment(index) {
    this.currentSegment = index;
    this.segmentIndex.emit(index);
  }
}

export class NSegmentItem{
  text: string;
  selectedImg: string;
  unSelectedImg: string;

  constructor(text: string, selectedImg: string, unSelectedImg: string){
    this.text = text;
    this.selectedImg = selectedImg;
    this.unSelectedImg = unSelectedImg;
  }
}