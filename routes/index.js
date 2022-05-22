var express = require("express");
var router = express.Router();
const { Employee, Manager, Project } = require("../models");
const { isLoggedIn } = require("./middlewares");
const { getUser, getDeptId } = require("./user");
const { Op } = require("sequelize");

// 요구사항 9번) 현재 진행 중인 프로젝트 페이지에서는 프로젝트 기본 내용과
// 프로젝트 참가 혹은 중지를 결정할 수 있다.(프로젝트 기본 내용 부분)
/* GET home page. */
router.get("/", async (req, res, next) => {
  console.log(req.state);
  let participate = null;
  let non_participate = null;
  if (req.state != "beforeLogin") {
    participate = await Emp_Proj.findAll({
      include: [
        {
          model: Employee,
          attributes: ["id"],
          where: { id: req.user.id },
        },
        {
          model: Project,
        },
        {
          model: Role,
        },
      ],
    });
    const participate_proj = participate.map((value) => {
      return value.Project.id;
    });
    non_participate = await Project.findAll({
      where: {
        id: { [Op.notIn]: participate_proj },
      },
    });
  }
  res.render("index", {
    title: "Express",
    state: req.state,
    prj_before: participate,
    prj_cur: non_participate,
  });
});

/* GET mypage */
router.get("/mypage", isLoggedIn, function (req, res, next) {
  const current_user = getUser(req.user);
  const emp_ID = current_user.emp_ID;

  res.render("mypage", { title: "Mypage", state: req.state, current_user });
});

/* GET mypageupdate */
router.get("/updateMyInfo", isLoggedIn, (req, res, next) => {
  const current_user = getUser(req.user);
  console.log(current_user);
  res.render("updateMyInfo", {
    title: "Mypage",
    state: req.state,
    current_user,
  });
});

// 요구사항 3번) 직원은 마이페이지를 통해
// 자신의 정보(경력과 기술, 직원번호, 직원명, 주민등록번호, 최종학력)를
// 데이터베이스에 저장 및 수정할 수 있다.
/* POST mypage */
router.post("/updateMyInfo", isLoggedIn, async (req, res, next) => {
  const { name, final_edu, skill, career, dept } = req.body;
  const Dept_id = getDeptId(dept);
  try {
    const afterEmp = await Employee.update(
      { emp_name: name, emp_final_edu: final_edu, skill, career, Dept_id },
      { where: { id: req.user.id } }
    );
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 요구사항 2번) 회원가입 시 회원 로그인은 중복 체크 기능을 추가하여
// 기 등록된 id로 회원가입 신청을 할 경우 에러 메시지를 출력하고
// 중복되지 않은 신규 id를 입력할 수 있어야 한다.(중복확인 버튼)
/* POST checkId */
router.post("/checkId", async (req, res, next) => {
  const { inputId } = req.body;
  if (inputId) {
    const exEmp = await Employee.findOne({ where: { emp_ID: inputId } });

    if (exEmp) {
      return res.send("사용 중인 아이디입니다.");
    } else {
      return res.send("사용할 수 있는 아이디입니다.");
    }
  } else {
    return res.send("아이디를 입력하세요");
  }
});

//관리 미들웨어 확인용(지울 것)
const { isAdmin } = require("./middlewares");
const { Emp_Proj, Dept, Role } = require("../models");
router.get("/isadmin", isLoggedIn, isAdmin, async (req, res, next) => {
  const participate = await Emp_Proj.findAll();
  const dept = await Dept.findAll();
  const project = await Project.findAll();
  const role = await Role.findAll();
  console.log(participate, dept, project, role);
  res.send(req.user);
});

// 요구사항 9번) 현재 진행 중인 프로젝트 페이지에서는 프로젝트 기본 내용과
// 프로젝트 참가 혹은 중지를 결정할 수 있다.(참가 부분)
/* 참가 */
router.post("/participateProj", async (req, res, next) => {
  console.log("참가");
  const { non_project_name, non_duration, non_organization, non_budget } =
    req.body;
  // const proj_start_date = new Date(non_duration.replace(" ", "").split("~")[0]);
  // console.log(proj_start_date);
  // console.log(non_project_name, non_duration, non_organization, non_budget);
  const participateProject = await Project.findOne({
    attributes: ["id", "proj_end_date"],
    where: { project_name: non_project_name },
  });
  console.log(participateProject.id);
  // const Project_id = await Project.findOne({ where: { project_name } });
  // const Project_id = req.params.prj;
  // const Employee_number = req.user.id;
  // const Project = await Project.findOne({ where: { id: Project_id } });
  const result = await Emp_Proj.create({
    part_start_date: Date.now(),
    part_end_date: participateProject.proj_end_date,
    Role_id: 1,
    Employee_number: req.user.id,
    Project_id: participateProject.id,
  });
  console.log("result");
  res.redirect("/");
});

// 요구사항 9번) 현재 진행 중인 프로젝트 페이지에서는 프로젝트 기본 내용과
// 프로젝트 참가 혹은 중지를 결정할 수 있다.(참가중지 부분)
/* 참가 중지 */
router.post("/stopProj", async (req, res, next) => {
  console.log("참가 중지");
  const {
    project_name,
    duration,
    participate_term,
    organization,
    budget,
    role,
  } = req.body;
  const participateProject = await Project.findOne({
    attributes: ["id"],
    where: { project_name },
  });
  console.log(participateProject.id);

  const result = await Emp_Proj.update(
    { part_end_date: Date.now() },
    {
      where: {
        Project_id: participateProject.id,
        Employee_number: req.user.id,
      },
    }
  );
  console.log(result);
  res.end();
});
module.exports = router;
