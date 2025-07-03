const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: { type: String, enum: ['ideas', 'todo', 'inprogress', 'completed'], required: true },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now },
  tags: [String],
  sharedWith: [String],
  reminded: { type: Boolean, default: false },
  userEmail: String
});

module.exports = mongoose.model('Task', taskSchema); 