const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new student
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update student
router.patch('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        Object.assign(student, req.body);
        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        
        await student.deleteOne();
        res.json({ message: 'Student deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark attendance
router.post('/attendance', async (req, res) => {
    try {
        const { studentId, date, isPresent } = req.body;
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if attendance already marked for this date
        const existingRecord = student.attendanceRecords.find(
            record => record.date.toISOString().split('T')[0] === date
        );

        if (existingRecord) {
            // Update existing record
            existingRecord.isPresent = isPresent;
        } else {
            // Add new record
            student.attendanceRecords.push({
                date: new Date(date),
                isPresent
            });
        }

        // Update total attendance count
        student.attendance = student.attendanceRecords.filter(record => record.isPresent).length;
        
        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 