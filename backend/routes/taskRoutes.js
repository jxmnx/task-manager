const express = require("express");
const router = express.Router();

const Task = require("../models/Task");

const auth = require("../middleware/auth");

router.get("/",auth,async(req,res)=>{

    const tasks =
    await Task.find({
        createdBy:req.user.id
    });

    res.json(tasks);

});

router.post("/",auth,async(req,res)=>{

    const task = new Task({

        title:req.body.title,

        description:req.body.description,

        createdBy:req.user.id

    });

    await task.save();

    res.json(task);

});

router.put("/:id",auth,async(req,res)=>{

    const task =
    await Task.findByIdAndUpdate(

        req.params.id,

        req.body,

        {new:true}

    );

    res.json(task);

});

router.delete("/:id",auth,async(req,res)=>{

    await Task.findByIdAndDelete(
        req.params.id
    );

    res.json({
        message:"Task Deleted"
    });

});

module.exports = router;