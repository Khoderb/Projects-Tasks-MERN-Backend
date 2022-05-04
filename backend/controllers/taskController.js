import Project from "../models/Project.js";
import Task from "../models/Task.js";



const addTask = async (req,res)=>{
    const { project } = req.body;
    const checkProject = await Project.findById(project);
    
    if(!checkProject){ 
        const error = new Error("Project not found");
        return res.status(404).json({msg:error.mesasge});
    }
    if( checkProject.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ message: error.message });
    } 
    try {
        const task = await Task.create(req.body);
        res.status(200).json(task);
    } catch (error) {
        console.log(error);
    }
}


const getTask = async (req,res)=>{
    const { id } = req.params
    const task = await Task.findById(id).populate('project');
    if(!task ) { 
        const error = new Error("Task not found");
        return res.status(404).json({msg:error.message});
    }
    if( task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(403).json({ message: error.message });
    }
    res.status(200).json(task);
}


const updateTask = async (req,res)=>{
    const { id } = req.params
    const task = await Task.findById(id).populate('project');
    
    if(!task ) { 
        const error = new Error("Task not found");
        return res.status(404).json({msg:error.message});
    }
    if( task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(403).json({ message: error.message });
    }
    try {
        task.name = req.body.name || task.name;
        task.description = req.body.description || task.description;
        task.pripority = req.body.pripority || task.pripority;
        task.deliveryDate = req.body.deliveryDate || task.deliveryDate;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
            console.log(error)
    }
}


const deleteTask = async (req,res)=>{
    const { id } = req.params
    const task = await Task.findById(id).populate('project');
    
    if(!task ) { 
        const error = new Error("Task not found");
        return res.status(404).json({msg:error.message});
    }
    if( task.project.creator.toString() !== req.user._id.toString()){
        const error = new Error('Unauthorized');
        return res.status(403).json({ message: error.message });
    }
    try  {
        await task.deleteOne();
        res.status(200).json({message:"Task deleted successfully"});
    } catch (error) {
        console.log(error);                
    }
}


const changeState = (req,res ) =>{}

export { 
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeState
}