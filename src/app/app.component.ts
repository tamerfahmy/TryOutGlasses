import { Component, OnInit } from '@angular/core';

declare var clm: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor() {}

  canvasInput: any;
  cc: any;
  ctracker: any;
  img: any;
  showFaceLandMarks = false;

  ngOnInit(): void {
    const video: any = document.getElementById('video');

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.play();
      });
    }
    let pModel;
    this.ctracker = new clm.tracker();
    this.ctracker.init(pModel);
    this.ctracker.start(video);
    let positions = this.ctracker.getCurrentPosition();
    this.canvasInput = document.getElementById('canvas');
    this.cc = this.canvasInput.getContext('2d');
    this.img = document.getElementById('glassess');
    this.drawLoop();
    // ctracker.track();
    // var drawCanvas = document.getElementById('myCanvas');
    // ctracker.draw(drawCanvas);
  }

  onFaceLandmarksCheckChange(event: any): void {
    this.showFaceLandMarks = event.target.checked;
  }

  tryGlass(id: any): void {
    if (id === '7') {
      const glassess7: any = document.getElementById('glassess7');
      this.img.src = glassess7.src;
    }

    if (id === '3') {
      const glassess3: any = document.getElementById('glassess3');
      this.img.src = glassess3.src;
    }

    if (id === '5') {
      const glassess5: any = document.getElementById('glassess5');
      this.img.src = glassess5.src;
    }
  }

  drawLoop(): void {
    requestAnimationFrame(() => this.drawLoop());
    this.cc.clearRect(0, 0, this.canvasInput.width, this.canvasInput.height);
    if (this.showFaceLandMarks) {
      this.ctracker.draw(this.canvasInput);
    }

    // get array of face marker positions [x, y] format
    const positions = this.ctracker.getCurrentPosition();

    const pupilLeft = positions[27];
    const pupilRight = positions[32];
    const faceLeft = positions[0];
    const faceRight = positions[14];
    const noseUp = positions[33];
    const noseMiddle = positions[41];

    const leftEye = positions[27];
    const rightEye = positions[32];

    if (positions) {
      const faceWidth = faceRight[0] - faceLeft[0];

      const glassesWidth = faceWidth;
      const glassesHeight = glassesWidth / (this.img.width / this.img.height);

      const glassesXPos = leftEye[0] - glassesWidth / 4;
      const glassesYPos = leftEye[1] - glassesHeight / 3;

      this.cc.drawImage(
        this.img,
        glassesXPos,
        glassesYPos,
        glassesWidth,
        glassesHeight
      );
    }
  }
}
