# Prestige Homes

Prestige Homes is a modern real estate web application that allows users to buy and sell properties with ease. The platform connects buyers and sellers, offering a seamless experience for property discovery, listing, and management.

## Features

- 🏠 Buy Properties:  
  - Browse thousands of verified property listings.
  - Search by location, property type, or keywords.
  - View detailed property information, images, and pricing.
  - Add properties to your wishlist for later viewing.

- 🏡 Sell Properties:  
  - List your property for sale with detailed information and images.
  - Manage your listings from your profile.
  - Secure and easy property submission process.

- 👤 User Accounts:  
  - Sign up and log in to manage your properties and wishlist.
  - Edit your profile and upload a profile picture.
  - Sign-in with email-password or google authetication using Firebase authetication

- ❤️ Wishlist:  
  - Save properties you are interested in for quick access.

- 🧮 Calculators:  
  - EMI Calculator
  - Loan Eligibility Calculator
  - Interest Rate Calculator

- 🏢 Home Interiors:  
  - Explore interior design companies and services links.

## Tech Stack

- Frontend: React, Tailwind CSS 3.x, Vite, Axios
- Backend: Django, Django REST Framework
- Database: Mysql
- Authentication: Firebase Auth (for frontend user management)
- APIs: RESTful endpoints for property and user management

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.10.0 & pip
- (Optional) Virtualenv

### Installation

#### 1. Clone the repository

```sh
git clone https://github.com/athulj4/prestige-homes.git
cd prestige-homes
```

#### 2. Backend Setup

```sh
cd backend
python -m venv ../virtual_env
source ../virtual_env/bin/activate  # or ../virtual_env/Scripts/activate on Windows
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

#### 3. Frontend Setup

```sh
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or as shown in your terminal), and the backend API at `http://localhost:8000`.

## Usage

- Buyers:  
  - Browse or search for properties on the homepage.
  - Click on a property to view details.
  - Add properties to your wishlist (requires login).

- Sellers:  
  - Log in and navigate to the "Sell" page.
  - Fill in property details and upload images.
  - Submit your listing for it to appear to buyers.

## Folder Structure

- `backend/` - Django backend project
- `frontend/` - React frontend project
- `media/` - Uploaded images and files
- `users/`, `listings/` - Django apps for user and property management

Current status: 
- CLean frontend with react and tailwindcss in javascript+SWC
- Functional firebase authetication
- Django admin authentication with firebase (token exchange method)
