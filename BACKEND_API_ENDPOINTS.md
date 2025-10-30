# Backend API Endpoints Documentation

**Base URL:** `https://live-class-lms1-672553132888.asia-south1.run.app`

## 🔐 Authentication
All protected routes require the `Authorization` header:
```
Authorization: Bearer <token>
```

---

## 📊 Mentor Dashboard Endpoints

### **1. Dashboard Cards/Stats**
Base: `/api/v1/mentor/cards`

#### Get Total Classes
```
GET /api/v1/mentor/cards/total-classes
```
**Description:** Get total number of classes for the authenticated mentor.

#### Get Total Courses
```
GET /api/v1/mentor/cards/total-courses
```
**Description:** Get total number of active programs/courses for the mentor.

#### Get Average Attendance
```
GET /api/v1/mentor/cards/avg-attendance
```
**Description:** Get average attendance rate for the mentor's classes.

---

### **2. Live Class Sessions**
Base: `/api/v1/liveclass`

#### Start Live Session
```
POST /api/v1/liveclass/session/start
```
**Body:**
```json
{
  "sessionId": 70,
  "facultyId": "17e9925d-fa94-46e2-8e30-3af37d7bab46"
}
```

#### End Live Session
```
POST /api/v1/liveclass/session/end
```
**Body:**
```json
{
  "sessionId": 70,
  "facultyId": "17e9925d-fa94-46e2-8e30-3af37d7bab46"
}
```

#### Get Active Sessions
```
GET /api/v1/liveclass/session/active
```
**Description:** Get all currently active/live sessions.

#### Get Session Status
```
GET /api/v1/liveclass/session/status/:sessionId
```
**Example:** `GET /api/v1/liveclass/session/status/70`
**Description:** Get detailed status of a specific session.

#### Get Batch Manager Sessions
```
GET /api/v1/liveclass/batch-manager/sessions
```
**Description:** Get all sessions for batch manager view.

#### Get Batch Manager Join Token
```
POST /api/v1/liveclass/batch-manager/join-token
```
**Body:**
```json
{
  "sessionId": 70,
  "batchManagerId": "manager-id"
}
```

---

### **3. Assignment Management**
Base: `/api/v1/mentor` (Note: Need to add this to routes)

#### Create Assignment
```
POST /api/v1/mentor/assignments
```
**Body:**
```json
{
  "title": "React Assignment 1",
  "description": "Build a todo app",
  "dueDate": "2025-11-15T23:59:59Z",
  "courseId": 4,
  "totalMarks": 100
}
```

#### Get All Assignments
```
GET /api/v1/mentor/assignments
```
**Query Parameters:**
- `courseId` (optional)
- `status` (optional): `draft`, `published`, `closed`

#### Get Assignment by ID
```
GET /api/v1/mentor/assignments/:assignmentId
```

#### Delete Assignment
```
DELETE /api/v1/mentor/assignments/:assignmentId
```

#### Add Question to Assignment
```
POST /api/v1/mentor/assignments/:assignmentId/questions
```
**Body:**
```json
{
  "questionText": "What is React?",
  "type": "mcq",
  "options": ["A library", "A framework", "A language", "A database"],
  "correctAnswer": "A library",
  "marks": 10
}
```

#### Upload Questions CSV
```
POST /api/v1/mentor/assignments/:assignmentId/questions/upload
```
**Content-Type:** `multipart/form-data`
**Body:** CSV file with questions

#### Delete Question
```
DELETE /api/v1/mentor/assignments/:assignmentId/questions/:questionId
```

#### Publish Assignment
```
POST /api/v1/mentor/assignments/:assignmentId/publish
```

#### Get Submissions
```
GET /api/v1/mentor/assignments/:assignmentId/submissions
```
**Description:** Get all student submissions for an assignment.

#### Grade Submission
```
POST /api/v1/mentor/assignments/:assignmentId/submissions/:submissionId/grade
```
**Body:**
```json
{
  "marks": 85,
  "feedback": "Great work! Needs improvement in error handling."
}
```

---

### **4. Schedule/Sessions (Student View)**
Base: `/api/v1/student/schedule`

#### Get Upcoming Sessions
```
GET /api/v1/student/schedule/class-schedule
```
**Description:** Get upcoming sessions for the authenticated user (useful for mentor to see their upcoming sessions).

---

## 🏫 Admin Endpoints (if Mentor has admin access)

### **Get All Scheduled Sessions**
```
GET /api/v1/admin/cards/scheduled-sessions
```

### **Get Mentor Reschedules**
```
GET /api/v1/admin/mentors/mentorReschedules
```

### **Get All Mentor Sessions**
```
GET /api/v1/admin/mentors/getAllSessions
```

---

## 📝 Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## 🎯 Session Object Structure
Based on your API, a typical session object looks like:
```json
{
  "id": 70,
  "section_id": 4,
  "session_datetime": "2025-08-25T14:00:00+05:30",
  "duration": 105,
  "venue": "",
  "status": "completed",
  "attendance_token": "att_0e8e9fc4-9120-496c-8acb-44571febe782",
  "token_expires_at": "2025-08-25T15:46:21.058+05:30",
  "session_type": "practical",
  "actual_faculty_id": "17e9925d-fa94-46e2-8e30-3af37d7bab46",
  "created_at": "2025-08-12T20:29:13.446636+05:30",
  "session_location_coordinates": null,
  "is_live": true,
  "rescheduled_date_time": null,
  "rescheduled_count": null,
  "course_id": 4,
  "course_code": "C3001",
  "course_name": "Full Stack Development 2"
}
```

---

## 🔧 Implementation in Mentor Dashboard

### Example: Fetch Active Sessions
```typescript
import { useApi } from '../services/api';

const { get } = useApi();

const fetchActiveSessions = async () => {
  try {
    const response = await get('https://live-class-lms1-672553132888.asia-south1.run.app/api/v1/liveclass/session/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active sessions:', error);
  }
};
```

### Example: Start a Session
```typescript
const { post } = useApi();

const startSession = async (sessionId: number, facultyId: string) => {
  try {
    const response = await post(
      'https://live-class-lms1-672553132888.asia-south1.run.app/api/v1/liveclass/session/start',
      { sessionId, facultyId }
    );
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
  }
};
```

---

## 📌 Key Endpoints for Mentor Dashboard Integration

### **Priority 1: Dashboard Overview**
1. ✅ `/api/v1/mentor/cards/total-classes` - Summary cards
2. ✅ `/api/v1/mentor/cards/total-courses` - Summary cards
3. ✅ `/api/v1/mentor/cards/avg-attendance` - Summary cards
4. ✅ `/api/v1/liveclass/session/active` - Active sessions widget

### **Priority 2: Live Sessions Tab**
1. ✅ `/api/v1/liveclass/session/active` - Show live sessions
2. ✅ `/api/v1/liveclass/session/start` - Start session button
3. ✅ `/api/v1/liveclass/session/end` - End session button
4. ✅ `/api/v1/liveclass/session/status/:id` - Session details

### **Priority 3: Schedule/Calendar**
1. ✅ `/api/v1/student/schedule/class-schedule` - Upcoming sessions
2. ✅ `/api/v1/admin/cards/scheduled-sessions` - All scheduled sessions

### **Priority 4: Assignments**
1. ✅ `/api/v1/mentor/assignments` - Assignment management
2. ✅ `/api/v1/mentor/assignments/:id/submissions` - View submissions

---

## 🔑 Authentication Flow
1. User logs in via `/api/v1/auth/login`
2. Receives JWT token
3. Store token in localStorage/context
4. Include token in all subsequent requests:
   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

---

## 🚀 Next Steps
1. Update API base URL in your frontend config
2. Implement API calls in mentor dashboard components
3. Handle authentication tokens
4. Test all endpoints with actual data

