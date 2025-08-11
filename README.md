# Project Title

## Introduction
An Event Management Website is built which helps to seamlessly create new events , rsvp guest lists.It will be provide a clear view of the events which are aligned in your calender.

## Project Type
Frontend 

## Deplolyed App
https://eventura-eta.vercel.app/signin

## Directory Structure
eventura/
├─ public/
│ 
│  ├─ favicon.ico
│  └─ ... (other static assets)
├─ src/
│  ├─ assets/
│  │  └─ ... (images, icons, etc.)
│  ├─ components/
│  │  ├─ EventWizard/
│  │  │  ├─ StepDateTime.jsx
│  │  │  ├─ StepDetails.jsx
│  │  │  ├─ StepLocation.jsx
│  │  │  ├─ StepMedia.jsx
│  │  │  └─ StepReview.jsx
│  │  ├─ rsvp/
│  │  │  └─ReminderScheduler.jsx
          |-RsvpDashboard.jsx
│  │  ├─ AppTour.jsx
│  ├─ context/
│  │  ├─ AuthContext.jsx
│  │  └─ EventContext.jsx
│  ├─ lib/
│  │  └─mockdb.js
        reminderRunner.js
│  ├─ pages/
│  │  ├─ auth/
│  │  │  ├─ AccountStep.jsx
│  │  │  ├─ PreferencesStep.jsx
│  │  │  ├─ ProfileStep.jsx
│  │  │  ├─ SignIn.jsx
│  │  │  └─ SignUpWizard.jsx
│  │  ├─ EventCreation.jsx
│  │  ├─ EventDetailsPage.jsx
│  │  ├─ Home.jsx
│  │  ├─ Navbar.jsx
│  │  ├─ ProfilePage.jsx
│  │  └─ RsvpPage.jsx
│  ├─ App.css
│  ├─ App.jsx
│  └─ index.css
├─ package.json
├─ package-lock.json / yarn.lock
├─ .gitignore
└─ README.md

     

## Video Walkthrough of the project
Attach a very short video walkthough of all of the features [ 1 - 3 minutes ]



## Features
List out the key features of your application.

- Sign In and Sign Up Page
- Event Creation Page
- Home Page showing all the events with filtering option
- RSVP page for setting up reminders

## design decisions or assumptions
Made a simple user friendly UI using Material UI library

## Installation & Getting started
Detailed instructions on how to install, configure, and get the project running. For BE/FS projects, guide the reviewer how to check mongodb schema etc.

```bash
npm install my-project
cd my-project
npm start
```

## Usage
Provide instructions and examples on how to use your project.

```bash
# Example
```

Include screenshots as necessary.

## Credentials
Provide user credentials for autheticated pages

mail id:niyalimukherjee25@gmail.com
Password:Niyali123@


## Technology Stack
List and provide a brief overview of the technologies used in the project.

- React.js
- Local Storage
- Material UI
