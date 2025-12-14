# Pétros Analysis

A comprehensive rock classification and analysis platform that uses advanced AI/ML models (YOLO) to identify, classify, and analyze rock samples. The platform provides detailed analysis reports with visualizations and generates downloadable PDF reports.

## 🎯 Project Overview

Pétros Analysis is a full-stack web application designed to assist geologists, researchers, and enthusiasts in identifying and analyzing rock types quickly and accurately. The platform utilizes YOLO (You Only Look Once) deep learning models for rock classification and provides comprehensive analysis including:

- Rock type classification
- Mineral region segmentation
- Spot detection (circular features)
- Area percentage calculations
- Visual analysis with annotated images
- PDF report generation

## 🏆 Achievements

This project has won **three hackathons**, showcasing its potential and versatility for real-world geology applications.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer with Pug templates
- **Payment**: Razorpay integration
- **Python Integration**: Child process execution for ML models

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript, JavaScript
- **Styling**: Tailwind CSS
- **UI Components**: NextUI, Framer Motion
- **Authentication**: NextAuth.js (Google OAuth)
- **Charts**: Chart.js, Recharts
- **PDF Generation**: jsPDF, html2pdf.js
- **3D Graphics**: Spline (@splinetool/react-spline)

### Machine Learning
- **Model**: YOLO v8 (Ultralytics)
- **Libraries**: 
  - OpenCV (cv2) for image processing
  - NumPy for numerical operations
  - Matplotlib for visualization
  - PyTorch & TorchVision

## 📁 Project Structure

```
petros/
├── backend/                          # Node.js/Express backend
│   ├── app.js                        # Express app configuration
│   ├── server.js                     # Server entry point
│   ├── package.json                  # Backend dependencies
│   │
│   ├── configuration/                # Configuration files
│   │   └── connectDB.js              # MongoDB connection setup
│   │
│   ├── controllers/                  # Route controllers
│   │   ├── authController.js        # Authentication & user management
│   │   ├── multerController.js       # Image upload & object detection
│   │   ├── viewController.js         # View rendering
│   │   │
│   │   ├── python/                   # YOLO object detection scripts
│   │   │   ├── detect_yolo.py        # General object detection with color
│   │   │   ├── main.py               # ESP32 video stream handler
│   │   │   ├── requirements.txt      # Python dependencies
│   │   │   └── yolov8l.pt            # YOLO model weights
│   │   │
│   │   ├── Python2/                  # Rock classification scripts
│   │   │   ├── script.py             # Main rock analysis script
│   │   │   ├── script2.py            # Alternative analysis script
│   │   │   └── rock_classification_yolo/  # Trained model directory
│   │   │       └── exp1/
│   │   │           ├── weights/
│   │   │           │   ├── best.pt   # Best model weights
│   │   │           │   └── last.pt   # Latest model weights
│   │   │           └── [training artifacts]
│   │   │
│   │   └── uploads/                   # Uploaded image storage
│   │
│   ├── models/                        # MongoDB schemas
│   │   ├── userModel.js              # User schema with password hashing
│   │   └── imageData.js              # Image/person data schema
│   │
│   ├── routes/                        # API routes
│   │   ├── userRoutes.js             # User authentication routes
│   │   ├── multerRoutes.js           # Image upload routes
│   │   └── viewRoutes.js             # View routes
│   │
│   ├── utils/                         # Utility functions
│   │   ├── appError.js               # Custom error class
│   │   ├── catchAsync.js             # Async error handler
│   │   └── email.js                  # Email service (Nodemailer)
│   │
│   ├── views/                         # Email templates
│   │   └── email/
│   │       ├── _style.pug            # Email styles
│   │       ├── baseEmail.pug         # Base email template
│   │       └── welcome.pug           # Welcome email template
│   │
│   ├── Yolo-Weights/                  # YOLO model weights
│   │   └── yolov8l.pt                # Large YOLO v8 model
│   │
│   └── rock_classification_yolo/     # Rock classification model
│       └── exp1/
│           └── weights/
│               ├── best.pt
│               └── last.pt
│
├── frontend/                          # Next.js frontend
│   ├── package.json                   # Frontend dependencies
│   ├── next.config.mjs                # Next.js configuration
│   ├── tailwind.config.ts             # Tailwind CSS configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   │
│   ├── public/                        # Static assets
│   │   ├── logo.png, logo1.png, logo2.png  # Application logos
│   │   ├── fonts/                     # Custom fonts (Orbitron)
│   │   └── [other assets]
│   │
│   └── src/
│       ├── app/                       # Next.js App Router pages
│       │   ├── layout.tsx             # Root layout
│       │   ├── page.tsx               # Home page
│       │   ├── globals.css            # Global styles
│       │   │
│       │   ├── (tabs)/                # Tab-based routing
│       │   │   ├── layout.tsx
│       │   │   ├── home/
│       │   │   │   └── page.tsx
│       │   │   └── player/
│       │   │       └── page.tsx
│       │   │
│       │   ├── about/                 # About page
│       │   ├── contactus/             # Contact page
│       │   ├── faq/                   # FAQ page
│       │   ├── login/                 # Login page
│       │   ├── signup/                # Signup page
│       │   │
│       │   ├── uploadData/            # Rock analysis upload page
│       │   ├── uploadData2/           # Alternative upload page
│       │   │
│       │   ├── create-pdf/            # PDF generation page
│       │   ├── create-pdf2/           # Alternative PDF generation
│       │   │
│       │   ├── api/                   # API routes
│       │   │   ├── auth/
│       │   │   │   └── [...nextauth]/  # NextAuth configuration
│       │   │   └── upload.js          # Image upload API
│       │   │
│       │   ├── components/            # Page-specific components
│       │   ├── context/               # React context providers
│       │   │   └── context.js        # Theme/global context
│       │   │
│       │   ├── form/                  # Form components
│       │   ├── payment/               # Payment integration
│       │   ├── razorpay/              # Razorpay payment handler
│       │   ├── spline/                # 3D Spline model component
│       │   └── googlelogin/           # Google OAuth handler
│       │
│       ├── components/                 # Reusable components
│       │   ├── Navbar.tsx             # Navigation bar
│       │   ├── Footer.tsx             # Footer component
│       │   ├── HeroSection.tsx        # Hero section with 3D model
│       │   ├── Winners.tsx            # Winners showcase
│       │   ├── PlayerCard.tsx         # Player card component
│       │   ├── styles.css             # Component styles
│       │   │
│       │   └── ui/                    # UI component library
│       │       ├── background-beams.tsx
│       │       ├── download-component.tsx
│       │       └── [other UI components]
│       │
│       └── utils/
│           └── cn.ts                  # Class name utility (clsx)
│
└── README.md                          # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd petros
```

#### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `config.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=3001
DATABASE=mongodb+srv://<username>:<PASSWORD>@cluster.mongodb.net/dbname
DATABASE_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@petros.com
```

#### 3. Python Dependencies

```bash
cd backend/controllers/python
pip install -r requirements.txt
```

Required Python packages:
- `ultralytics==8.0.0`
- `opencv-python==4.7.0`
- `torch==2.0.1`
- `torchvision==0.15.2`
- `numpy==1.24.2`
- `matplotlib==3.7.1`

#### 4. Frontend Setup

```bash
cd frontend
npm install
```

#### 5. Run the Application

**Backend:**
```bash
cd backend
npm run dev  # Development mode with nodemon
# or
npm start    # Production mode
```

**Frontend:**
```bash
cd frontend
npm run dev  # Development server (usually http://localhost:3000)
```

## 📡 API Endpoints

### Authentication Routes (`/api/v1/users`)

- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/forgetPassword` - Request password reset
- `PATCH /api/v1/users/resetPassword/:token` - Reset password with token

### Analysis Routes

- `POST /api/v1/users/create` - Upload image and analyze rock (script.py)
- `POST /api/v1/users/create2` - Upload image and analyze rock (script2.py)
- `POST /api/v1/multer/create` - Object detection with YOLO

### Payment Routes

- `POST /api/v1/users/makerequest` - Create Razorpay order
- `POST /api/v1/users/validation` - Validate Razorpay payment

### Data Routes

- `POST /api/v1/users/buy` - Create person/image data record

## 🔐 Authentication

The application supports multiple authentication methods:

1. **JWT-based Authentication**: Traditional email/password with JWT tokens
2. **Google OAuth**: NextAuth.js integration for Google sign-in
3. **Cookie-based Sessions**: HTTP-only cookies for secure token storage

### Password Security

- Passwords are hashed using bcryptjs (12 rounds)
- Password reset tokens are hashed with SHA-256
- Reset tokens expire after 10 minutes

## 🧠 Machine Learning Models

### YOLO v8 Model

The application uses two main YOLO models:

1. **General Object Detection** (`yolov8l.pt`)
   - Detects objects in images
   - Identifies object colors
   - Returns bounding boxes

2. **Rock Classification Model** (`rock_classification_yolo/exp1/weights/best.pt`)
   - Custom-trained model for rock classification
   - Provides confidence scores
   - Generates annotated images

### Analysis Features

The rock analysis script (`script.py`) provides:

- **Rock Classification**: Identifies rock type with confidence score
- **Spot Detection**: Detects circular features using HoughCircles
- **Mineral Segmentation**: Segments different mineral regions using LAB color space
- **Area Analysis**: Calculates area percentages for each mineral region
- **Visualizations**: 
  - Annotated images with bounding boxes
  - Segmented images with color-coded regions
  - Bar charts for area percentages
  - Pie charts for mineral distribution
  - Scatter plots for region sizes

## 📊 Features

### Core Features

1. **Rock Image Upload**: Multi-image upload support
2. **AI-Powered Analysis**: YOLO-based rock classification
3. **Visual Analysis**: Annotated images with detection results
4. **Mineral Segmentation**: Automatic region detection and area calculation
5. **PDF Report Generation**: Downloadable analysis reports
6. **User Authentication**: Secure login/signup with email verification
7. **Payment Integration**: Razorpay for premium features
8. **Email Notifications**: Welcome emails and password reset

### User Interface

- **Modern Design**: Dark theme with gradient effects
- **3D Graphics**: Spline 3D models for visual appeal
- **Responsive Layout**: Mobile-friendly design
- **Interactive Charts**: Real-time data visualization
- **Smooth Animations**: Framer Motion for transitions

## 🔧 Configuration

### Environment Variables

**Backend (`config.env`):**
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `DATABASE`: MongoDB connection string
- `DATABASE_PASSWORD`: MongoDB password
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time
- `EMAIL_*`: Email service configuration

**Frontend:**
- NextAuth configuration for Google OAuth
- API endpoint URLs

### Model Weights

Ensure the following model files are present:
- `backend/Yolo-Weights/yolov8l.pt`
- `backend/rock_classification_yolo/exp1/weights/best.pt`
- `backend/rock_classification_yolo/exp1/weights/last.pt`

## 📝 Development

### Code Structure

- **Backend**: MVC pattern with separate routes, controllers, and models
- **Frontend**: Next.js App Router with component-based architecture
- **Python Scripts**: Modular functions for ML processing

### Error Handling

- Custom `AppError` class for consistent error responses
- `catchAsync` wrapper for async route handlers
- Try-catch blocks in Python scripts

### File Upload

- Multer middleware for handling multipart/form-data
- Image validation (JPEG, JPG, PNG, GIF)
- Temporary storage in `uploads/` directory

## 🧪 Testing

Currently, the project doesn't include automated tests. Manual testing can be done through:

1. Postman/Thunder Client for API endpoints
2. Browser DevTools for frontend debugging
3. Python scripts can be tested independently

## 🚧 Future Enhancements

Potential improvements:

- [ ] Automated test suite (Jest, Cypress)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Enhanced model accuracy with more training data
- [ ] Real-time analysis with WebSocket
- [ ] Mobile app (React Native)
- [ ] Batch image processing
- [ ] Advanced analytics dashboard
- [ ] User history and saved analyses

## 👥 Team

- **Arun Rathaur**
- **Shaurya**
- **Karan**

## 📄 License

[Specify your license here]

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Contact

For questions or support, please contact the development team.

## 🙏 Acknowledgments

- Ultralytics for YOLO models
- Next.js team for the excellent framework
- All contributors and hackathon judges

---

**Note**: This project requires significant computational resources for ML model inference. Ensure adequate GPU/CPU resources for optimal performance.

