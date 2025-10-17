import { Component } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { AuditService } from './audit.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

  export class AppComponent {
    username: string | null = null;
    constructor(public auth: AuthServiceService, private router: Router, private audit: AuditService) {
      this.username = localStorage.getItem('username');
    }
  

    
    goToLogin() {
      this.router.navigate(['/login']);
    }
  
    logout() {
      const user = localStorage.getItem('username');
      if (user) {
        this.audit.logLogout(user); // log logout
      }
      this.auth.logout();
      this.username = null;
      this.router.navigate(['/fonduri']);
    }
  
  

    openAudit() {

        window.open('http://localhost:8081/admin/audit/ultimele-12-luni', '_blank');

      }
      
    }
    
    
