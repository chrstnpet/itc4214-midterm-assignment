# ITC4214-Internet Programming Midterm Assignment Instructions

---

## Specifications

You will create a task management application for a company  of your choice where users can manage their tasks. The application will have five pages: Home, Tasks, About, Contact, and one page of your choice. All DOM manipulation should be done using jQuery. The HTML should be well-formed with appropriate metadata, and the website should be fully responsive.

---

## Page Requirements

### Home Page (`index.html`)
1. **Welcome Section**
   - Introduction about the company.  
   - Overview of products or features.  
   - A call-to-action button linking to the Tasks page.  

2. **Latest Activity**
   - Displays the most recent task actions (added, completed, deleted).  

3. **Navigation Bar**
   - Sticky header with the app logo, title, and navigation links.  

4. **API Integration**
   - Fetch data from a public API (e.g., motivational quotes, weather) and display dynamically.  

5. **Dark Mode Toggle**
   - Users can switch between light and dark themes.  

---

### Tasks Page (`tasks.html`)
1. **Task Management**
  - A form to add new tasks, including fields for the task name, description, and due date.
  - A table or list of tasks showing the task name, description, due date, and status.
  - Edit and delete buttons for each task.
  - A button to mark tasks as completed.
  - Add a section showing a summary of total tasks, pending tasks, and completed tasks.
  - Bonus: Allow users to assign priorities (e.g., High, Medium, Low) to tasks. Color code each priority level and enable filtering by priority. 

2. **Filtering & Sorting**
   - Filter tasks by status: All, Completed, Pending.  
   - Sort tasks by due date or task name.  

3. **Task Analytics Dashboard**
   - Create a small dashboard (you could put it on the Home page or a new page called analytics.html) that visualizes task data — such as a bar chart showing completed vs. pending tasks, or pie chart by priority.

---

### About Page (`about.html`)
1. **About Section**
   - Information about the app, its purpose, and key features.  

2. **Team Members**
   - A section to display information about team members with avatars, names, and roles. If you do not have a team, pretend that you do!  

3. **Grid Cards**
   - A grid layout with cards showing team members’ names, avatars, and short info.

4. **Carousel**
   - A carousel with images or testimonials related to the application or development process. If you like you can put the carousel in the home page as well. 

---

### Contact Page (`contact.html`)
1. **Contact Form**
   - A form that collects the user's name, email, subject, and message.
   - When submitted, the details should be captured and appear as a pop-up on the screen.
  

2. **Google Maps Integration**
   - Embed a map showing the office or team location.  

3. **Social Media Links**
   - Include icons linking to company or team social profiles.  

---

### Custom Page (Your Choice)
- Name the HTML file according to its context.
- Must include the same header and footer as all other pages.  
- Should feature three unique components of your choice.

---

### General Requirements for All Pages:
  1.	CSS Framework:
    -  Use a CSS framework of your choice (e.g., Bootstrap) to style the website.
  2. Responsive Design:
    - Ensure the website is fully responsive and works well on all devices (desktop, tablet, mobile).
  3. Footer Section:
    - A footer with the application logo, copyright information, and contact details (social media links, email).
  4.	Accessibility:
    - Ensure the website meets basic accessibility standards (e.g., proper use of ARIA labels, alt text for images, proper meta tags etc).

---

### Additional Technical Requirements:
  1. Responsive Navigation:
     - Implement a responsive navigation menu that collapses into a hamburger menu on smaller screens.
  2. Form Validation:
     - Implement client-side form validation for all forms.
  3. Version Control:
     - Use Git for version control with a repository hosted on GitHub, GitLab, or Bitbucket.
  4. Presentation:
     - Create a short presentation to demonstrate to your classmates, the basic structure, and components of the client-side framework, which you chose to implement for your assignment. You must be able to present your assignment in-class without a notice and explain your code in detail within a short notice after your submission to get a passing grade.
