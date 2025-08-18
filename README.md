# Vroom! Auto Insurance Platform

Full-stack insurance management system built with Nuxt.js, Nuxt UI, and PostgreSQL. Features complex relational data modeling with temporal relationships, policy lifecycle management, claims processing, and multi-role party management.


# TODO List

## 📋 Policies
### Database & Models
- [x] Set up policy table schema with sequences
- [x] Configure policy status enum validation
- [x] Create policy-party relationship tables
- [x] Create database indexes for performance

### API Routes
- [ ] `POST /api/policies` - Create new policy
- [ ] `GET /api/policies/:id` - Get policy with relationships
- [ ] `PUT /api/policies/:id` - Update policy details
- [ ] `GET /api/policies` - List/search policies
- [ ] `POST /api/policies/:id/renew` - Policy renewal
- [ ] `DELETE /api/policies/:id` - Cancel policy
- [ ] `GET /api/policies/:id/history` - Policy change history

### Stores & State
- [ ] Main policy store with CRUD operations
- [ ] Policy wizard store for creation flow
- [ ] Policy search/filter state management
- [ ] Coverage selection state management

### UI Components
- [ ] Policy creation wizard (7-step stepper)
  - [ ] Basic info step
  - [ ] Named insured step
  - [ ] Vehicle details step
  - [ ] Additional parties step
  - [ ] Coverage selection step
  - [ ] Review step
  - [ ] Confirmation step
- [ ] Policy dashboard/list view
- [ ] Policy detail view
- [ ] Policy renewal interface
- [ ] Coverage modification forms

### Business Logic
- [ ] Policy number generation
- [ ] State-specific coverage requirements
- [ ] Premium calculation logic
- [ ] Policy validation rules
- [ ] Renewal date calculations

## 🚗 Vehicles
### Database & Models
- [ ] Vehicle table with policy relationships
- [ ] Vehicle-party relationship management
- [ ] Vehicle coverage selection
- [ ] VIN validation and uniqueness
- [ ] Vehicle history tracking

### API Routes
- [ ] `POST /api/vehicles` - Add vehicle to policy
- [ ] `GET /api/vehicles/:id` - Get vehicle details
- [ ] `PUT /api/vehicles/:id` - Update vehicle info
- [ ] `DELETE /api/vehicles/:id` - Remove from policy
- [ ] `POST /api/vehicles/:id/parties` - Assign drivers/owners
- [ ] `GET /api/vehicles/:id/coverages` - Get vehicle coverages

### Stores & State
- [ ] Vehicle management store
- [ ] Vehicle search and filtering
- [ ] Driver assignment state
- [ ] Vehicle coverage state

### UI Components
- [ ] Vehicle add/edit forms
- [ ] VIN decoder integration
- [ ] Vehicle card display
- [ ] Driver assignment interface
- [ ] Vehicle coverage selector
- [ ] Garaging address input

### Business Logic
- [ ] VIN format validation
- [ ] Vehicle value estimation
- [ ] Driver eligibility checks
- [ ] Vehicle-specific coverage rules
- [ ] Usage type validation

## 📄 Claims
### Database & Models
- [ ] Claims table with policy references
- [ ] Claim-vehicle relationships
- [ ] Claim-party relationships (claimants, witnesses)
- [ ] Claim status workflow
- [ ] Coverage snapshot preservation
- [ ] Claim documents/attachments

### API Routes
- [ ] `POST /api/claims` - File new claim
- [ ] `GET /api/claims/:id` - Get claim details
- [ ] `PUT /api/claims/:id` - Update claim
- [ ] `GET /api/claims` - List/search claims
- [ ] `POST /api/claims/:id/status` - Update claim status
- [ ] `POST /api/claims/:id/documents` - Upload documents
- [ ] `GET /api/claims/:id/timeline` - Claim activity log

### Stores & State
- [ ] Claims management store
- [ ] Claim filing workflow state
- [ ] Claim status tracking
- [ ] Document upload state

### UI Components
- [ ] Claim filing wizard
- [ ] Claims dashboard
- [ ] Claim detail view
- [ ] Status update interface
- [ ] Document upload component
- [ ] Claim timeline view
- [ ] Claimant information forms

### Business Logic
- [ ] Claim validation rules
- [ ] Status workflow enforcement
- [ ] Coverage verification
- [ ] Settlement calculations
- [ ] Deductible applications

## 👥 Customers (Parties)
### Database & Models
- [ ] Parties table (people/organizations)
- [ ] People table with personal details
- [ ] Organizations table for commercial entities
- [ ] Contact information management
- [ ] License information tracking
- [ ] Customer relationships

### API Routes
- [ ] `POST /api/customers` - Create new customer
- [ ] `GET /api/customers/:id` - Get customer profile
- [ ] `PUT /api/customers/:id` - Update customer info
- [ ] `GET /api/customers` - Search customers
- [ ] `GET /api/customers/:id/policies` - Customer policies
- [ ] `GET /api/customers/:id/claims` - Customer claims
- [ ] `POST /api/customers/:id/contacts` - Add contact method

### Stores & State
- [ ] Customer management store
- [ ] Customer search functionality
- [ ] Contact information state
- [ ] Customer relationship tracking

### UI Components
- [ ] Customer profile view
- [ ] Customer creation/edit forms
- [ ] Customer search interface
- [ ] Contact management
- [ ] Customer policy history
- [ ] Customer claims history
- [ ] Relationship mapping

### Business Logic
- [ ] Customer deduplication
- [ ] Contact validation (email, phone)
- [ ] License validation by state
- [ ] Customer risk assessment
- [ ] Communication preferences

## 👤 Users (System Users)
### Database & Models
- [ ] Users table with authentication
- [ ] User roles and permissions
- [ ] User-customer relationships
- [ ] Session management
- [ ] Password security
- [ ] User activity logging

### API Routes
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/login` - User authentication
- [ ] `POST /api/auth/logout` - Session termination
- [ ] `GET /api/users/profile` - Get user profile
- [ ] `PUT /api/users/profile` - Update profile
- [ ] `POST /api/users/password` - Change password
- [ ] `GET /api/users/:id/activity` - User activity log

### Stores & State
- [ ] Authentication store
- [ ] User profile management
- [ ] Permission checking
- [ ] Session state management

### UI Components
- [ ] Login/registration forms
- [ ] User profile page
- [ ] Password change interface
- [ ] User dashboard
- [ ] Navigation with role-based access
- [ ] Account settings
- [ ] Activity history view

### Business Logic
- [ ] Password strength validation
- [ ] Role-based access control
- [ ] Session timeout handling
- [ ] Account lockout policies
- [ ] Two-factor authentication (optional)

## 🔧 Cross-Cutting Concerns
### Global Features
- [ ] Error handling and logging
- [ ] Loading states across all modules
- [ ] Data validation framework
- [ ] Notification system
- [ ] Audit trail functionality
- [ ] PDF generation for documents
- [ ] Email notifications
- [ ] Responsive design
- [ ] Accessibility compliance
- [ ] Performance optimization

### Testing
- [ ] Unit tests for all stores
- [ ] API endpoint testing
- [ ] Component testing
- [ ] Integration tests
- [ ] End-to-end testing for workflows

### Documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] Business rules documentation
- [ ] User guides
- [ ] Developer setup instructions



## Generate Database Types
```bash
yarn kysely-codegen --dialect postgres --connectionString "$DATABSE_URL" --out-file app/types/db.ts
```

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
