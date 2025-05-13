# NexivoTechs - Modern Tech Solutions Landing Page

A professional landing page for NexivoTechs, featuring a modern design, responsive layout, and interactive features. This project showcases a tech company's services, portfolio, and blog while providing user engagement through contact forms and newsletter subscriptions.

![NexivoTechs Landing Page](images/nexivo.png)

## 🌟 Features

### Core Features
- Responsive design that works on all devices
- Modern and clean UI with smooth animations
- Interactive navigation with scroll effects
- Dynamic content sections
- Blog system with detailed articles
- Contact form with email notifications
- Newsletter subscription system
- Admin panel for content management

### Technical Features
- MVC Architecture
- Node.js backend with Express
- Nodemailer integration for emails
- Session-based authentication
- File-based data storage
- RESTful API endpoints
- Form validation and error handling
- Responsive image handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Gmail account (for email functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nexivotechs.git
cd nexivotechs
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=3000
SESSION_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
BASE_URL=http://localhost:3000
```

4. For Gmail setup:
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password:
     1. Go to Google Account → Security
     2. Under "2-Step Verification", click "App passwords"
     3. Select "Mail" and "Other (Custom name)"
     4. Name it "NexivoTech Contact Form"
     5. Copy the generated password
     6. Use this password as EMAIL_PASS in your .env file

### Running the Application

1. Start the server:
```bash
node app.js
```

2. Access the application:
   - Main page: http://localhost:3000
   - Admin panel: http://localhost:3000/admin.html
   - Blog posts: http://localhost:3000/blog/

## 📁 Project Structure

```
nexivotechs/
├── app.js                 # Main application file
├── routes/               # Route handlers
│   ├── index.js         # Main routes
│   ├── admin.js         # Admin panel routes
│   ├── contact.js       # Contact form handling
│   ├── auth.js          # Authentication routes
│   └── newsletter.js    # Newsletter subscription
├── data/                # Data storage
│   └── subscriptions.json
├── public/              # Static files
│   ├── images/         # Image assets
│   └── css/           # Stylesheets
├── views/              # EJS templates
└── blog/              # Blog posts
```

## 💡 Key Features Explained

### Contact Form
- Real-time form validation
- Email notifications for new submissions
- Success/error feedback to users
- Spam prevention

### Newsletter System
- Email validation
- Duplicate subscription prevention
- Welcome emails
- Persistent storage of subscriptions
- User-friendly feedback

### Admin Panel
- Secure login system
- Dashboard with key metrics
- User management
- Analytics overview
- Content management

### Blog System
- Responsive blog layout
- Category-based organization
- Rich content formatting
- SEO-friendly structure

## 🔒 Security Features

- Environment variable protection
- Session-based authentication
- Form validation and sanitization
- Secure password handling
- Protected admin routes

## 🛠️ Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Bootstrap 5
  - Font Awesome

- **Backend:**
  - Node.js
  - Express.js
  - Nodemailer
  - Express-session

- **Development Tools:**
  - Git
  - npm
  - dotenv

## 📝 API Endpoints

### Contact Form
- `POST /contact`
  - Handles contact form submissions
  - Sends email notifications

### Newsletter
- `POST /newsletter/subscribe`
  - Processes newsletter subscriptions
  - Sends welcome emails

### Admin
- `POST /admin/login`
  - Handles admin authentication
- `GET /admin/dashboard`
  - Retrieves dashboard data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Bootstrap for the responsive framework
- Font Awesome for the icons
- Google Fonts for typography
- All contributors who have helped shape this project

## 📞 Support

For support, email support@nexivotechs.com or create an issue in the repository.

---

Made with ❤️ by NexivoTechs Team 