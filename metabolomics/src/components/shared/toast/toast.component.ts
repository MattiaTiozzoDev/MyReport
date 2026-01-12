import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'my-report-toast',
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit {
  public type: string = 'error';
  public show = false;
  public message: string;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.$show.subscribe((res) => {
      this.type = res.type;
      this.show = res.show;
      this.message = res.message;
    });
  }

  public hide() {
    this.show = false;
  }
}
