# DMello - Enterprise Angular Architecture

## 📁 Project Structure Overview

This document provides a guide to the folder structure and how to use it effectively.

```
src/app/
├── core/                          # Application-wide services and utilities
│   ├── guards/                   # Route guards (auth, permissions, etc.)
│   │   └── auth.guard.ts
│   ├── interceptors/             # HTTP interceptors (error, logging, auth)
│   │   ├── error.interceptor.ts
│   │   └── http-request.interceptor.ts
│   ├── services/                 # Core singleton services
│   │   ├── logger.service.ts
│   │   └── error-handler.service.ts
│   └── core.module.ts
│
├── shared/                        # Shared across features
│   ├── components/               # Reusable UI components
│   ├── services/                 # Shared services
│   │   ├── auth.service.ts
│   │   ├── base-http.service.ts
│   │   └── storage.service.ts
│   ├── models/                   # Data models/interfaces
│   │   ├── user.model.ts
│   │   ├── auth.model.ts
│   │   └── api.model.ts
│   ├── validators/               # Custom form validators
│   │   └── custom.validators.ts
│   ├── styles/                   # Global styles
│   │   ├── variables.scss
│   │   ├── global.scss
│   │   └── mixins.scss
│   ├── utils/                    # Utility functions
│   │   └── common.utils.ts
│   ├── constants/                # Application constants
│   │   └── app.constants.ts
│   ├── types/                    # TypeScript type definitions
│   │   └── common.types.ts
│   └── shared.module.ts
│
├── features/                      # Feature modules
│   └── auth/                     # Authentication feature
│       ├── components/
│       │   ├── login/
│       │   │   ├── login.component.ts
│       │   │   ├── login.component.html
│       │   │   ├── login.component.scss
│       │   │   └── login.component.spec.ts
│       │   └── forgot-password/
│       │       ├── forgot-password.component.ts
│       │       ├── forgot-password.component.html
│       │       ├── forgot-password.component.scss
│       │       └── forgot-password.component.spec.ts
│       ├── services/
│       ├── models/
│       ├── auth.routes.ts
│       └── auth.module.ts (optional)
│
├── layouts/                       # Layout components
│   └── root-layout/
│       └── root-layout.component.ts
│
├── config/                        # Application configuration
│   ├── http.config.ts
│   ├── app.config.ts
│   └── environment-specific configs
│
├── app.ts                         # Root component
├── app.html                       # Root template
├── app.scss                       # Root styles
├── app.routes.ts                  # Main routing configuration
└── app.config.ts                  # Application configuration (interceptors, providers)
│
environments/
├── environment.ts                 # Development configuration
└── environment.prod.ts            # Production configuration
│
assets/
├── images/
├── icons/
└── fonts/
```

---

## 📚 Folder Guidelines

### `core/`
**Purpose**: Application-wide singleton services, guards, and interceptors
- ✅ **DO**: Put guards, interceptors, and core services here
- ✅ **DO**: Services that are used globally (logging, error handling, auth)
- ❌ **DON'T**: Put feature-specific logic here
- ❌ **DON'T**: Put reusable UI components here (use `shared/components`)

**Examples**:
- `auth.guard.ts` - Protects routes requiring authentication
- `error.interceptor.ts` - Handles all HTTP errors globally
- `logger.service.ts` - Centralized logging utility

---

### `shared/`
**Purpose**: Reusable functionality shared across multiple features
- ✅ **DO**: Put components used in multiple features (buttons, cards, forms)
- ✅ **DO**: Put services used across features
- ✅ **DO**: Put common constants, validators, utilities
- ✅ **DO**: Put data models and types
- ❌ **DON'T**: Put feature-specific logic
- ❌ **DON'T**: Put feature-specific services

**Subfolders**:
- `components/` - Reusable UI components (SearchBox, FilterPanel, etc.)
- `services/` - Shared services (AuthService, StorageService)
- `models/` - Data models and interfaces
- `validators/` - Custom form validators
- `styles/` - Global SCSS variables, mixins, and styles
- `utils/` - Utility functions (string, array, date utilities)
- `constants/` - App-wide constants
- `types/` - TypeScript type definitions

---

### `features/`
**Purpose**: Feature-specific code organized by feature
- ✅ **DO**: Organize each feature in its own folder
- ✅ **DO**: Keep feature-specific components, services, and models together
- ✅ **DO**: Use lazy-loading for features via routing
- ✅ **DO**: Create sub-services for feature-specific API calls
- ❌ **DON'T**: Reference code from other features directly
- ❌ **DON'T**: Put shared logic in feature folders

**Structure per feature**:
```
features/auth/
├── components/            # Feature components (Login, ForgotPassword)
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   ├── login.component.scss
│   │   └── login.component.spec.ts
│   └── forgot-password/
├── services/             # Feature-specific services
│   └── auth.service.ts   # Auth API calls specific to this feature
├── models/               # Feature-specific models
├── auth.routes.ts        # Feature routing
└── auth.module.ts        # Feature module (optional)
```

**Future Features to Add**:
```
features/
├── auth/
├── dashboard/
├── projects/
├── users/
└── settings/
```

---

### `layouts/`
**Purpose**: Layout wrapper components
- ✅ **DO**: Create layout components for different page layouts
- ✅ **DO**: Use in routing configuration
- ❌ **DON'T**: Put business logic in layouts

**Examples**:
- `root-layout/` - Main application layout
- `auth-layout/` - Login/Auth pages layout
- `dashboard-layout/` - Dashboard with sidebar

---

### `config/`
**Purpose**: Application-wide configuration files
- ✅ **DO**: Put all configuration constants here
- ✅ **DO**: Keep environment-specific configs here
- ❌ **DON'T**: Put feature configs here

**Examples**:
- `http.config.ts` - HTTP client settings
- `app.config.ts` - Application providers and configuration
- `api.config.ts` - API endpoint configuration

---

### `environments/`
**Purpose**: Environment-specific configuration
- ✅ **DO**: Use for dev/prod/staging environment variables
- ✅ **DO**: Import based on build environment

**Usage**:
```typescript
import { environment } from '@env/environment';

const apiUrl = environment.apiUrl;
```

---

## 🚀 How to Add New Features

### Step 1: Create Feature Folder
```bash
mkdir -p src/app/features/my-feature/components
mkdir -p src/app/features/my-feature/services
```

### Step 2: Create Feature Routing
```typescript
// src/app/features/my-feature/my-feature.routes.ts
import { Routes } from '@angular/router';
import { MyFeatureComponent } from './components/my-feature/my-feature.component';

export const MY_FEATURE_ROUTES: Routes = [
  {
    path: '',
    component: MyFeatureComponent
  }
];
```

### Step 3: Add to Main Routes
```typescript
// src/app/app.routes.ts
{
  path: 'my-feature',
  loadChildren: () => import('./features/my-feature/my-feature.routes')
    .then(m => m.MY_FEATURE_ROUTES)
}
```

### Step 4: Create Components with Reactive Forms
```typescript
// src/app/features/my-feature/components/my-feature/my-feature.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-feature',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './my-feature.component.html',
  styleUrl: './my-feature.component.scss'
})
export class MyFeatureComponent implements OnInit {
  myForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }
}
```

---

## 📝 Form Best Practices

### ✅ DO: Use Reactive Forms
```typescript
this.form = this.fb.group({
  email: ['', [Validators.required, CustomValidators.emailFormat()]],
  password: ['', [Validators.required, Validators.minLength(8)]]
});
```

### ❌ DON'T: Use Template-Driven Forms
```typescript
// Avoid: <input [(ngModel)]="email" />
```

### Custom Validators
Use `CustomValidators` from `shared/validators/`:
```typescript
import { CustomValidators } from '@shared/validators/custom.validators';

this.form = this.fb.group({
  password: ['', [CustomValidators.passwordStrength()]],
  email: ['', [CustomValidators.emailFormat()]]
});
```

---

## 🔌 Services Best Practices

### Core Services (Singletons)
Use `providedIn: 'root'` to ensure single instance:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService { }
```

### Feature-Specific Services
```typescript
@Injectable({ providedIn: 'root' })
export class MyFeatureService { }
```

### Base HTTP Service
Extend `BaseHttpService` for API calls:
```typescript
export class MyApiService extends BaseHttpService {
  constructor(http: HttpClient, logger: LoggerService) {
    super(http, logger);
  }

  getData(): Observable<any> {
    return this.get('/api/data');
  }
}
```

---

## 🎨 Styling Best Practices

### Global Variables
Import and use shared variables:
```scss
@import '../../shared/styles/variables.scss';

.my-component {
  color: $text-primary;
  padding: $space-lg;
  border-radius: $radius-lg;
}
```

### SCSS Mixins
Use provided mixins:
```scss
.my-button {
  @include flex-center;
  @include button-reset;
}
```

---

## 🧪 Testing

### Component Tests Location
Keep `.spec.ts` files with components:
```
components/
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   └── login.component.spec.ts  ← Here!
```

### Service Tests Location
Keep `.spec.ts` files with services:
```
services/
├── auth.service.ts
└── auth.service.spec.ts  ← Here!
```

---

## 📦 Dependencies to Install (if needed)

```bash
npm install --save-dev @types/jasmine karma karma-jasmine karma-chrome-launcher
npm install --save rxjs tslib
```

---

## 🔐 Constants and Configuration

### Using App Constants
```typescript
import { APP_CONSTANTS, API_ENDPOINTS } from '@shared/constants/app.constants';

const loginUrl = API_ENDPOINTS.AUTH.LOGIN;
const appName = APP_CONSTANTS.APP_NAME;
```

### Using Environment Config
```typescript
import { environment } from '@env/environment';

const apiUrl = environment.apiUrl;
```

---

## ✅ Pre-Implementation Checklist

- [x] Folder structure created
- [x] Routing foundation set up
- [x] HTTP interceptors configured
- [x] Core services and guards created
- [x] Shared utilities and validators created
- [x] Auth feature with Reactive Forms created
- [x] Configuration files created
- [x] Styles and variables set up
- [x] Type definitions created
- [x] Unit test templates provided
- [x] Documentation created

---

## 🎯 Next Steps

1. **Implement Business Features**:
   - Create new features in `features/` folder
   - Follow the same pattern as auth feature
   - Use Reactive Forms for all form inputs

2. **Add State Management** (if needed):
   - Consider NgRx or Akita
   - Add state folder alongside features

3. **Implement Unit Tests**:
   - Use provided spec templates
   - Keep tests close to source code

4. **Setup CI/CD**:
   - Configure build pipeline
   - Add automated testing
   - Setup deployment automation

5. **Performance Optimization**:
   - Lazy load all feature modules
   - Enable production mode
   - Optimize bundle size

---

## 📞 Questions?

Refer to the inline comments in component files for specific implementation guidance.
