import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-castlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './castlist.html',
  styleUrls: ['./castlist.css']
})
export class Castlist implements OnInit {
  @Input() cast: string[] = [];

  ngOnInit(): void {
    console.log('cast recieved ', this.cast)
  }
}
