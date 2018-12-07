const Joi = require("joi");
const express = require("express");

const app = express();
app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

// simple send
app.get("/", (req, res) => {
  res.send("hello world");
});

// return all courses
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// post a new course
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body); // destructuring - better
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

// find an entry with get .find
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

// return posts with year and month params
app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params);
});

// return results with a ?
app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.query);
});

// PUT
app.put("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  //const result = validateCourse(req.body);
  const { error } = validateCourse(req.body); // destructuring - better
  if (error) return res.status(400).send(error.details[0].message);

  course.name = req.body.name;
  res.send(course);
});

// delete a course
app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

// validate function
function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };
  return Joi.validate(course, schema);
}

// listen on the server node
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
