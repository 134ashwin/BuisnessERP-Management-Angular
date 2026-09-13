//this will be the main file to display Our Project

import { Component } from '@angular/core';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RouterOutlet } from '@angular/router';

@Component
    ({
        standalone: true,
        selector: 'app-root',
        templateUrl: './app.html',
        imports: [RouterOutlet],
    })

export class AppComponent {

};

