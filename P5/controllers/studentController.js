const Student = require("../models/Student");
const addStudent = async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getStudents = async (req, res) => {
    try{
        const student=await Student.find();
        res.json(student);
    }
    catch(error) {
        res.status(500).json({ message : error.message});
    }
}
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student)
            return res.status(404).json({ message: "Student Not Found" });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateStudent = async (req, res) => {
    try{
        const student = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            returnDocument: "after"
        }
        );
        if (!student)
            return res.status(404).json({ message: "Student Not Found" });
        res.json(student);
    }
    catch(error) {
        res.status(500).json({ message : error.message});
    }
}
const deleteStudent = async (req, res) => {
    try{
        const student=await Student.findByIdAndDelete(req.params.id,);
        if (!student)
            return res.status(404).json({ message: "Student Not Found" });
        res.json({ message: "Student Deleted Successfully" });
    }
    catch(error) {
        res.status(500).json({ message : error.message});
    }
}
module.exports = {
    addStudent,
    updateStudent,
    deleteStudent,
    getStudents,
    getStudentById
};