var express = require('express');
var router = express.Router();
var {Project, Emp_Proj} = require('../models');

// 직원- 프로젝트 관리
router.get('/projectList', function(req, res, next) {
    res.render('employee/projectList', { title: 'projectList' });
  });

// 직원- 프로젝트 등록
router.get('/createProject', function(req, res, next) {
    res.render('employee/createProject', { title: 'createProject' });
  });

//프로젝트 등록 & PM 등록
router.post('createProject',async (req,res,next)=>{
  const {name, start_date, end_date, organization, budget} = req.body;

  try{
    //프로젝트 등록부분
    const new_proj = await Project.create({
      project_name:name,
      proj_start_date:start_date,
      proj_end_date:end_date,
      budget,
      project_organization:organization
    });
    console.log(new_proj);
    //PM 등록부분
    const proj_PM = await Emp_Proj.create({
      part_start_date:start_date,
      part_end_date:end_date,
      Role_id,
      Employee_number:id,
      Project_id:new_proj.id
    })
    console.log(proj_PM);


  }catch(error){
    console.error(error);
    return next(error);
  }

})
module.exports = router;