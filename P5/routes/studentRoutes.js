const express = require("express");
const router = express.Router();
const {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

router.post("/add", addStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;