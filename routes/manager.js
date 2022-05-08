var express = require('express');
var router = express.Router();


// 경영진 - 직원검색
router.get('/searchEmployee', function(req, res, next) {
    res.render('manager/searchEmployee', { title: 'searchEmployee' });
  });

// 경영진 - 프로젝트검색
router.get('/searchProject', function(req, res, next) {
    res.render('manager/searchProject', { title: 'searchProject' });
  });
  

module.exports = router;