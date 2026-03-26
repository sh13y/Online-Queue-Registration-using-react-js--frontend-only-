# Frontend-Backend Integration Summary

## ✅ Integration Complete

### What's Been Done

1. **API Configuration**
   - ✅ Axios client setup with base URL: `http://localhost:8080/api`
   - ✅ JWT token interceptor (auto-adds tokens to requests)
   - ✅ Error handling with automatic redirects

2. **Authentication Context**
   - ✅ Global auth state management with `useAuth()` hook
   - ✅ User login/signup/logout
   - ✅ Token storage in localStorage
   - ✅ Automatic token persistence on page reload

3. **Service Modules** (All endpoints mapped)
   - ✅ `authService.js` - User registration
   - ✅ `branchService.js` - Branch management (`/v1/branches`)
   - ✅ `serviceService.js` - Service management (`/v1/service`)
   - ✅ `queueService.js` - Queue operations (`/v1/queues`)
   - ✅ `notificationService.js` - Notifications (`/v1/notification`)
   - ✅ `userPreferencesService.js` - Settings (`/v1/user-preferences`)
   - ✅ `priorityUserService.js` - Priority users (`/v1/priority-users`)
   - ✅ `crowdLevelService.js` - Crowd data (`/v1/crowd-levels`)
   - ✅ `userService.js` - User management (`/v1/user`)
   - ✅ `counterService.js` - Counter operations (`/v1/counter`)
   - ✅ `adminStaffService.js` - Admin staff (`/v1/admin-staff`)

4. **Components Integration**
   - ✅ `LoginPage.jsx` - Signup with backend
   - ✅ `JoinQueue.jsx` - Fetch branches/services, submit queue join
   - ✅ `TrackQueue.jsx` - Fetch queue position, real-time tracking
   - ⏳ `NotificationsPage.jsx` - Ready to integrate
   - ⏳ `Settings.jsx` - Ready to integrate
   - ⏳ `CrowdLevel.jsx` - Ready to integrate

---

## 🧪 Test Flow

### Step 1: Signup Page ✅
```
Frontend: http://localhost:5173
1. Click "Sign Up"
2. Fill in form:
   - Full Name: John Doe
   - Email: john@example.com
   - Phone: 0771234567
   - Password: password123
3. Accept terms
4. Click "Join QueueSmart"
5. ✅ Should see dashboard
```

**Backend Call**: `POST /v1/user`
**Expected Response**:
```json
{
  "status": 201,
  "message": "User created successfully",
  "data": {
    "userId": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

---

### Step 2: Join Queue ✅
```
Frontend: Dashboard → "Join Queue"
1. View available services (from /v1/service)
2. Select a service
3. Select a branch location (from /v1/branches)
4. Click "Join Queue Now"
5. ✅ Should get token number
```

**Backend Call**: `POST /v1/queues/join`
**Request Body**:
```json
{
  "userId": 1,
  "serviceId": 1,
  "branchId": 1
}
```

**Expected Response**:
```json
{
  "status": 201,
  "message": "Successfully joined queue",
  "data": {
    "queueId": 5,
    "token": "SQ-2024-03-26-001",
    "userId": 1,
    "position": 3,
    "status": "PENDING",
    "estimatedWaitTime": 25
  }
}
```

---

### Step 3: Track Queue ✅
```
Frontend: Dashboard → "Track Queue"
1. View your token number
2. See current position
3. Estimated wait time
4. Click refresh to update
5. ✅ Should show real-time position
```

**Backend Call**: `GET /v1/queues/user/{userId}`
**Expected Response**:
```json
{
  "status": 200,
  "message": "User queues retrieved",
  "data": [
    {
      "queueId": 5,
      "token": "SQ-2024-03-26-001",
      "position": 2,
      "status": "PENDING",
      "estimatedWaitTime": 15
    }
  ]
}
```

---

### Step 4: Get Notifications ⏳
```
Frontend: Dashboard → "Notifications"
Backend Call: GET /v1/notification/user/{userId}
Expected:
- Queue called notifications
- Crowd level alerts
- Service updates
```

---

### Step 5: View Crowd Levels ⏳
```
Frontend: Dashboard → "Crowd Level"
Backend Call: GET /v1/crowd-levels
Expected:
- Branch-wise crowd density
- Capacity usage
- Current wait times
```

---

### Step 6: Update Settings ⏳
```
Frontend: Dashboard → "Settings"
Backend Call: PUT /v1/user-preferences
Expected:
- Save notification preferences
- Theme settings
- Language settings
```

---

## 🔍 Debugging Tips

### Check Network Requests
1. Open Browser DevTools (F12)
2. Go to "Network" tab
3. Perform an action (e.g., Join Queue)
4. Look for requests to `localhost:8080`
5. Check response under "Response" tab

### Common Issues

#### CORS Error (403)
- **Cause**: Backend CORS not configured for `localhost:5173`
- **Solution**: Ask backend team to add CORS config

#### 404 Not Found
- **Cause**: Wrong endpoint path
- **Solution**: Check service file endpoints match documentation

#### Auth Token Issues
- **Cause**: Token not being sent with requests
- **Solution**: Check localStorage for `authToken`

```javascript
// Open browser console and run:
localStorage.getItem('authToken')
localStorage.getItem('user')
```

---

## 📋 API Endpoints Reference

| Feature | Method | Endpoint | Service |
|---------|--------|----------|---------|
| Register | POST | `/v1/user` | authService |
| Get Branches | GET | `/v1/branches` | branchService |
| Get Services | GET | `/v1/service` | serviceService |
| Join Queue | POST | `/v1/queues/join` | queueService |
| Track Queue | GET | `/v1/queues/user/{userId}` | queueService |
| Get Notifications | GET | `/v1/notification/user/{userId}` | notificationService |
| Get Crowd Levels | GET | `/v1/crowd-levels` | crowdLevelService |
| Update Preferences | PUT | `/v1/user-preferences` | userPreferencesService |

---

## 🚀 Next Steps

### Priority 1 - Core Features
- [ ] Test signup flow end-to-end
- [ ] Test join queue flow
- [ ] Test queue tracking
- [ ] Fix any API response mapping issues

### Priority 2 - Additional Features
- [ ] Integrate Notifications page
- [ ] Integrate Settings page
- [ ] Integrate Crowd Level page
- [ ] Add real-time updates (WebSocket)

### Priority 3 - Admin Features
- [ ] Admin Dashboard integration
- [ ] Priority Queue management
- [ ] Counter management
- [ ] Staff management

---

## 📝 Notes

- **Backend Authentication**: Currently no JWT implemented - using temporary token approach
- **Database**: H2 In-Memory (data lost on server restart)
- **CORS**: Configured for `localhost:5173` and `localhost:5174`
- **Response Format**: All endpoints return `{ status, message, data }`

---

**Last Updated**: 2024-03-26  
**Status**: ✅ Ready for Testing
