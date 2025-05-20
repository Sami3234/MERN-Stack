const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true,
        enum: [
            'Computer Science',
            'Electrical Engineering',
            'Mechanical Engineering',
            'Business Administration',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Economics',
            'Psychology',
            'English'
        ]
    },
    campus: {
        type: String,
        required: true,
        enum: [
            'Islamabad',
            'Lahore',
            'Sahiwal',
            'Attock',
            'Wah',
            'Abbottabad',
            'Vehari'
        ]
    },
    program: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    cgpa: {
        type: Number,
        min: 0,
        max: 4,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'graduated', 'suspended'],
        default: 'active'
    },
    courses: [{
        courseId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        creditHours: {
            type: Number,
            required: true
        },
        grade: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'F', 'W', 'I'],
            default: 'I'
        },
        attendance: [{
            date: {
                type: Date,
                required: true
            },
            isPresent: {
                type: Boolean,
                default: false
            }
        }]
    }],
    contact: {
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    parentInfo: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
studentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student; 