import Project from "../models/Project.js"
import Task from "../models/Task.js";
const getProjects = async (req, res) => {
    const getProjects = await Project.find().where("creator").equals(req.user);
    res.json(getProjects);
}

const newProject = async (req,res) => {
    const project = new Project(req.body);
    project.creator = req.user._id;
    
    try {
        const savedProject = await project.save();
        res.json(savedProject);        
    } catch (error) {
        console.log ('new project',error);
    }
}

const getOneProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ message: error.message });
    }
    
    if( project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ message: error.message });
    } 
    //get tasks asociated to the project
    const tasks = await Task.find().where("project").equals(project._id);
    res.json({project, tasks});
}

const updateOneProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ message: error.message });
    }
    
    if( project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ message: error.message });
    } 
    
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
    project.client = req.body.client || project.client;

    try {
        const projectUpdated  = await project.save();
        return res.status(200).json(projectUpdated);
    } catch (error) {
        console.log(error)
    }
}   

const deleteOneProject = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    
    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ message: error.message });
    }
    
    if( project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ message: error.message });
    } 
    try {
        await project.deleteOne(); //.romeve() works too
        return res.status(200).json({ message: "Project deleted" });
    } catch (error) {     
        console.log(error);
    }
}



const addContributor = async (req, res) => {

}

const deleteContributor = async (req, res) => {

}


export {
    getProjects, 
    newProject,
    getOneProject,
    updateOneProject,
    deleteOneProject,
    addContributor,
    deleteContributor,
}