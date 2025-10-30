import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css'
})
export class Reviews {
  @Input() reviews: { author: string; content: string}[] = [];
  @Input() hasPurchased: boolean = false;

  @Output() reviewSubmitted = new EventEmitter<any>();

  newReview = { author: '', content: ''};

  submitReview(){
    console.log(this.newReview.author, this.newReview.content)
    if (!this.newReview.author || !this.newReview.content) {
      console.log("inside if ",this.newReview.author, this.newReview.content)
      // alert('Please');
      return;
    }
    this.reviewSubmitted.emit(this.newReview);
    this.newReview = { author: '', content: ''};
  }
  expandedReviews: boolean[] = [];

getTrimmedContent(content: string, index: number): string {
  const words = content.split(' ');
  const limit = 30;

  if (this.expandedReviews[index] || words.length <= limit) {
    return content;
  }

  return words.slice(0, limit).join(' ') + '...';
}

shouldShowSeeMore(content: string, index: number): boolean {
  return content.split(' ').length > 30;
}

toggleExpand(index: number, event: Event): void {
  event.preventDefault();
  this.expandedReviews[index] = !this.expandedReviews[index];
}
}
