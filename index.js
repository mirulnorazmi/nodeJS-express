const  express = require('express');
const app = express();
const Joi  = require('joi');

//app.get('path/url', callback funtion shouldhave two arguments (req,res) => {}) method takes two argument
//app.post()
//app.put()
//app.delete()

app.use(express.json())

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
]

app.get('/', (req,res) => {
    res.send('Hello World')
});

app.get('/api/courses' , (req,res) => {
    res.send(courses);
})

app.post('/api/courses',(req,res) => {
    const { error } = validateCourse(req.body) // getting result.error
     //400 Bad Request
    if (error) return res.status(400).send(result.error.details[0].message) 

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

app.delete('/api/course/:id', (req,res) =>{
    // Look up the course 
    // Not Existing, return 404
    let course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given Id was not Found!') //404 object not found

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index,1)
    //Return the same course
    res.send(course)
});

/*
** PUT
*/
app.put('/api/courses/:id', (req,res) => {
    // Look up the course
    // If not existing, return 404
    let course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given Id was not Found!') //404 object not found

    // Validate 
    // If invalid, return 400 - Bad Request
    const { error } = validateCourse(req.body) // getting result.error
    if (error){
        //400 Bad Request
        res.status(400).send(result.error.details[0].message)
        return;
    }

    // Update course 
    course.name = req.body.name;

    // Return  the updated course
    res.send(course)
});

function validateCourse(course){
    const schema  = Joi.object({
        name: Joi.string().min(3).required()
    })

   return schema.validate(course)
}


app.get('/api/courses/:id', (req,res) => {
   let course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send('The course with the given Id was not Found!') //404 object not found
    res.send(course)

    
});

app.get('/api/posts/:year/:month', (req,res) => {
    res.send(req.params);
});

//PORT for env. variable dynamic or static port / dev or prod env...
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}....`))