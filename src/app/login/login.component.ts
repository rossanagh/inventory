import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../audit.service';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  username = '';
  password = '';
  error = false;

  constructor(private authService: AuthServiceService, private router: Router, private audit: AuditService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/fonduri']);
    }
  }
  
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('username', this.username);   // ca să-l avem la logout
        this.audit.log(this.username, 'Login');            // <-- LOG LOGIN
        this.router.navigate(['/fonduri']);
        
      },
      error: () => { this.error = true; }
    });
  }
}

