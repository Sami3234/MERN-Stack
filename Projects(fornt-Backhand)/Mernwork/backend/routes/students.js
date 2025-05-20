const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .pdf, .jpg, .jpeg, and .png files are allowed!'));
  }
});

// Handle admission form submission
router.post('/admission', upload.fields([
  { name: 'cnicCopy', maxCount: 1 },
  { name: 'previousDegree', maxCount: 1 },
  { name: 'transcript', maxCount: 1 },
  { name: 'photo', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Received admission form data:', req.body);
    console.log('Received files:', req.files);

    const {
      name,
      dateOfBirth,
      gender,
      nationality,
      cnic,
      email,
      phoneNumber,
      address,
      city,
      country,
      previousSchool,
      previousDegree,
      previousGPA,
      yearOfCompletion,
      department,
      program,
      semester,
      admissionType,
      parentName,
      parentOccupation,
      parentPhone,
      parentEmail
    } = req.body;

    // Generate a unique student ID
    const studentId = `STU${Date.now().toString().slice(-6)}`;

    // Create new student record
    const student = new Student({
      studentId,
      name,
      dateOfBirth,
      gender,
      nationality,
      cnic,
      email,
      phoneNumber,
      address: {
        street: address,
        city,
        country
      },
      department,
      program,
      semester: parseInt(semester),
      enrollmentDate: new Date(),
      status: 'Pending',
      parentInfo: {
        name: parentName,
        occupation: parentOccupation,
        phone: parentPhone,
        email: parentEmail
      },
      academicHistory: {
        previousSchool,
        previousDegree,
        previousGPA: parseFloat(previousGPA),
        yearOfCompletion: parseInt(yearOfCompletion)
      },
      documents: {
        cnicCopy: req.files.cnicCopy ? req.files.cnicCopy[0].path : null,
        previousDegree: req.files.previousDegree ? req.files.previousDegree[0].path : null,
        transcript: req.files.transcript ? req.files.transcript[0].path : null,
        photo: req.files.photo ? req.files.photo[0].path : null
      }
    });

    console.log('Saving student record:', student);
    await student.save();
    console.log('Student record saved successfully');

    res.status(201).json({
      success: true,
      message: 'Admission form submitted successfully',
      data: {
        studentId: student.studentId,
        name: student.name,
        department: student.department,
        program: student.program
      }
    });
  } catch (error) {
    console.error('Admission form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit admission form',
      error: error.message
    });
  }
});

// Get all students
router.get('/', auth, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({ message: 'Error fetching student' });
    }
});

// Create new student
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can add students' });
        }

        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({ message: 'Error creating student' });
    }
});

// Update student
router.patch('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can update students' });
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({ message: 'Error updating student' });
    }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can delete students' });
        }

        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({ message: 'Error deleting student' });
    }
});

// Mark attendance
router.post('/:id/attendance', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can mark attendance' });
        }

        const { courseId, date, isPresent } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = student.courses.find(c => c.courseId === courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const attendanceDate = new Date(date);
        const existingAttendance = course.attendance.find(
            a => a.date.toISOString().split('T')[0] === attendanceDate.toISOString().split('T')[0]
        );

        if (existingAttendance) {
            existingAttendance.isPresent = isPresent;
        } else {
            course.attendance.push({ date: attendanceDate, isPresent });
        }

        await student.save();
        res.json(student);
    } catch (error) {
        console.error('Mark attendance error:', error);
        res.status(500).json({ message: 'Error marking attendance' });
    }
});

// Update grade
router.patch('/:id/courses/:courseId/grade', auth, async (req, res) => {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can update grades' });
        }

        const { grade } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const course = student.courses.find(c => c.courseId === req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.grade = grade;
        await student.save();
        res.json(student);
    } catch (error) {
        console.error('Update grade error:', error);
        res.status(500).json({ message: 'Error updating grade' });
    }
});

module.exports = router; 