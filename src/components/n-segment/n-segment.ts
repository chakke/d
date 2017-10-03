import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'n-segment',
  templateUrl: 'n-segment.html'
})
export class NSegmentComponent {
  @Input("segments") segments: Array<string> = [];
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
