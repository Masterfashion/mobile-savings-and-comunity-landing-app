# Mobile Savings and Community App

A web-based mobile savings and community application that allows users to register, create or join savings groups, and manage deposits and withdrawals through mobile money services.

## Features

### 👤 User Management
- **Registration**: Register with ID number, phone number, full name, and password
- **Login/Logout**: Secure authentication with session persistence
- **Profile Display**: View your ID, phone number, and name on the dashboard

### 👥 Savings Groups
- **Create Groups**: Set up new savings groups with custom names, descriptions, and monthly contribution amounts
- **Join Groups**: Discover and join existing savings groups
- **View Groups**: See all groups you're a member of with detailed information
- **Track Members**: Monitor group membership and participation

### 💰 Transactions
- **Deposit Funds**: Add money to your savings groups
- **Withdraw Funds**: Take money out from your balance
- **Mobile Money Support**: 
  - Orange Money
  - My Zaka
  - Smega
- **Balance Tracking**: Real-time balance updates across all groups
- **Transaction History**: View all your past deposits and withdrawals

### 📊 Contribution Tracking
- Total balance across all groups
- Individual group balances
- Transaction timestamps
- Group contribution overview

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Masterfashion/mobile-savings-and-comunity-landing-app.git
cd mobile-savings-and-comunity-landing-app
```

2. Open the application:
```bash
# Option 1: Using Python 3
python3 -m http.server 8080

# Option 2: Using Node.js
npx http-server -p 8080

# Option 3: Simply open index.html in your browser
```

3. Navigate to `http://localhost:8080` in your web browser

## Usage

### First Time Users

1. **Register an Account**
   - Enter your ID number (any unique identifier)
   - Enter your phone number (format: +243 XXX XXX XXX)
   - Enter your full name
   - Create a password
   - Click "Register"

2. **Login**
   - Enter your ID number
   - Enter your password
   - Click "Login"

3. **Create or Join a Group**
   - Click "Create Group" to start a new savings group
   - Or click "Join Group" to join an existing one

4. **Make Transactions**
   - Click "Transaction"
   - Select deposit or withdrawal
   - Choose your mobile money provider
   - Select the group
   - Enter the amount
   - Click "Process Transaction"

## Technology Stack

- **HTML5**: Structure and content
- **CSS3**: Styling with responsive design and gradients
- **JavaScript (ES6+)**: Application logic and interactivity
- **localStorage**: Client-side data persistence

## File Structure

```
mobile-savings-and-comunity-landing-app/
├── index.html      # Main HTML structure with all pages
├── styles.css      # All styling including responsive design
├── app.js          # Application logic and data management
└── README.md       # Documentation
```

## Features in Detail

### Data Storage
All data is stored locally in your browser using localStorage:
- User accounts
- Savings groups
- Transaction history
- Session state

**Note**: Clearing browser data will remove all saved information.

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface
- Gradient purple theme

### Form Validation
- Phone number format validation
- Required field checks
- Duplicate user prevention
- Balance verification for withdrawals

## Security Considerations

This is a demonstration application with client-side storage only. For production use, consider:
- Backend server for data persistence
- Encrypted password storage
- HTTPS for secure communication
- Multi-factor authentication
- Integration with real mobile money APIs

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue on GitHub.
