# CampusBite - Online Food Pre-Order System for Campus Canteens

An interactive, responsive web application built with **React**, **Vite**, and **React Router** designed for university campus canteens. It enables students to pre-order meals to eliminate lunch queues, allows canteen kitchen staff to manage food stock and live orders, and gives administrators full oversight of campus dining facilities.

---

## 🚀 Key Features & Bug Fixes Implemented

### 1. 🛒 Full Interactive Shopping Cart
- **Add to Cart Anywhere**: Add meals directly from the Canteen Menu (`/canteens/:id/menu`) or the Student Dashboard recommendations (`/student`).
- **Interactive Quantity Controls**: Increase (`+`) or decrease (`−`) item quantities with immediate price recalculation.
- **Item Removal & Empty States**: Remove individual items or clear the entire cart. Clean empty-cart view with direct links back to canteen menus.
- **Cooking Instructions**: Add custom notes per food item (e.g., "Less spicy", "No onions").
- **Pickup Scheduling & Dining Preference**: Select exact pickup time slots and toggle between **🥡 Takeaway** and **🍽️ Dine-in**.
- **Payment Method Selection**: Choose between Pay at Counter (Cash), Student ID Card balance, or Online QR/Card.
- **Toast Notifications**: Floating visual confirmation whenever meals are added or modified.
- **Persistent Storage**: Cart state automatically syncs to `localStorage`, preserving items on page reloads.

### 2. 📦 Real-Time Order Lifecycle & Tracking
- **Order Placement**: Placing an order immediately creates a unique Order ID (`#CBxxxx`) with timestamp, breakdown, and estimated pickup time.
- **Live 5-Stage Timeline**: Visual progress tracker showing `Placed` ➔ `Accepted` ➔ `Preparing` ➔ `Ready for Pickup` ➔ `Completed`.
- **Order Synchronization**: Orders placed by students instantly appear in the **Canteen Worker Portal** queue!
- **Order Management**: Filter by Active or Completed orders, cancel pending orders, or use the **🔁 Order Again** button to re-add past items with 1 click.

### 3. 👨‍🍳 Canteen Worker & Kitchen Dashboard (`/worker`)
- **Synchronized Order Queue**: Receive student orders in real time. Advance order statuses (`Accept Order` ➔ `Start Preparing` ➔ `Mark Ready` ➔ `Complete Order`).
- **Live Food Stock & Target Tracking**: Set daily targets, track cooked portions vs. portions sold, and calculate available portions automatically.
- **Instant Sold-Out Toggle**: Toggle availability with one click. When an item is marked "Sold Out", the student menu immediately reflects it and disables ordering.

### 4. 🛡️ Administrator Dashboard (`/admin`)
- **Live Analytics**: Real-time KPI statistics for Total Active Canteens, Menu Food Items, Total Orders Placed, and Total Campus Revenue.
- **Facility Management**: Register new canteens with operating hours and cuisine descriptions. Toggle facility operational status or delete canteens.

### 5. 🔍 Real-Time Search & Filtering
- Search campus canteens and menu meals instantly by keyword, location, or cuisine.
- Filter food items by category tabs: `All`, `Breakfast`, `Lunch`, `Snacks`, `Drinks`.

### 6. 👥 Role-Based Authentication & 1-Click Quick Demo
- Built-in `AuthContext` managing Student, Kitchen Worker, and Administrator profiles.
- **1-Click Demo Logins** on `/login`:
  - 🎓 **Student**: `IT20231234`
  - 👨‍🍳 **Kitchen Staff**: `worker001`
  - 🛡️ **Administrator**: `admin001`

---

## 🛠️ Tech Stack

- **Frontend**: React 19, JavaScript (ES Modules)
- **Routing**: React Router DOM 7
- **Build Tool**: Vite 7
- **Styling**: Vanilla Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Responsive Media Queries)
- **State Management**: React Context API (`CartContext`, `OrderContext`, `FoodContext`, `AuthContext`) + `localStorage` persistence

---

## 💻 How to Run the Project

1. Open a terminal in the project directory:
   ```bash
   cd "D:\watch\canteen system\Online-Food-Pre-Order-System-for-Campus-Canteens"
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite local development server:
   ```bash
   npm run dev
   ```

4. Open the URL printed in the terminal (usually `http://localhost:5173/`) in your browser.

---

## 🌐 Demo Navigation Routes

| Route | Description |
|---|---|
| `/` or `/home` | Public Landing Page with hero showcase and features overview |
| `/login` | Authentication page with 1-click Quick Demo logins |
| `/register` | Student registration with validation and auto-login |
| `/student` | Student Dashboard with canteen directory and recommended meals |
| `/canteens` | Directory of all active campus canteens with search |
| `/canteens/:id/menu` | Interactive menu with live cart totals, search, and stock status |
| `/cart` | Dynamic cart with quantity modifier, notes, and checkout |
| `/orders` | Order history & live 5-step pickup progress timeline |
| `/worker` | Kitchen worker order processing queue and daily stock manager |
| `/admin` | Campus dining facilities manager and real-time revenue stats |
