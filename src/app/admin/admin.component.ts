import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone:false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  logs: AuditLog[] = [];

  ngOnInit(): void {
    fetch('http://localhost:8080/api/audit')
      .then(res => res.json())
      .then(data => this.logs = data);
  }
}

export interface AuditLog {
  id: number;
  username: string;
  action: string;
  timestamp: string;
}