# Koi Fish Transportation Management System

## Introduction
The Koi Fish Transportation Management System is designed to provide modern features that ensure safe, efficient, and reliable transportation of Koi fish. The system includes functionalities such as online order placement, route optimization, transportation process management, and pre- and post-transportation services for Koi fish.

---

## Key Features
### 1. **For Customers**
- Place orders online.
- View pricing tables based on weight, quantity, and transportation method.
- Track orders from placement to completion.
- Access policies, blogs, FAQs, and news related to Koi fish transportation.
- Provide ratings and feedback on the service.

### 2. **For Staff**
- Manage the transportation process: health checks, packing, transportation, and acclimatization support for Koi fish.
- Assign orders to routes and transportation vehicles.
- Update order statuses (received, in transit, delivered).

### 3. **For Managers**
- Optimize transportation routes.
- Manage pricing and additional service packages.
- Generate reports and analytics (revenue, order volume, customer feedback).
- Manage employee information, customer data, and order history.

---

## System Architecture
The system is built using an MVC architecture, comprising:
1. **Frontend**: User-friendly interface supporting multiple platforms.
2. **Backend**: RESTful API handling business logic.
3. **Database**: MySQL for storing customer, order, and transportation data.

---

## Installation
### System Requirements
- **Node.js** >= 14.x
- **MySQL** >= 8.x
- **Git**
- **Postman** (optional, for API testing)

### Installation Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/phatcanlez/SWP391.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure the database:
    - Create a MySQL database.
    - Update the `.env` file with the following details:
      ```env
      DB_HOST=localhost
      DB_PORT=3306
      DB_USER=root
      DB_PASSWORD=password
      DB_NAME=koi_transport
      ```
4. Start the application:
    ```bash
    npm start
    ```
5. Access the application at: `http://localhost:3000`

---

## API Documentation
Detailed API documentation is available in the `/docs/api-docs` directory or via the [Postman Collection](link-to-postman-collection).

---

## Contact Information
- **Email**: support@koi-transport.com
- **Phone**: 0858800987
- **Website**: [koikichi.io.vn](http://koikichi.io.vn/)

---

## License
This project is licensed under the [MIT License](LICENSE).
