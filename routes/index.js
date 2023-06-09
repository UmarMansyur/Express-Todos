const router = require('express').Router();
const { signUp, login, logout } = require('../controllers/auth');
const passport = require('passport');
const query = require('../config/db');
const auth = require('./auth');

// const db = require('../db');

router.use('/', auth);

async function fetchTodos(req, res, next) {
  try {
    const { id } = req.user[0];
    const response = await query("SELECT * FROM todos WHERE owner_id = ?", [id]);
    if (response) {
      const todos = response.map(function (row) {
        return {
          id: row.id,
          title: row.title,
          completed: row.completed == 1 ? true : false,
          url: '/' + row.id
        };
      });
      res.locals.todos = todos;
      res.locals.activeCount = todos.filter(function (todo) { return !todo.completed; }).length;
      res.locals.completedCount = todos.length - res.locals.activeCount;
      return res.locals.todos;
    }
  } catch (error) {
    next(error);
  }
}

router.get('/', async (req, res, next) => {
  try {
    if(!req.user) {
      return res.redirect('/login');
    }
    await fetchTodos(req, res, next);
    res.locals.filter = null;
    return res.render('index', { user: req.user[0], todos: res.locals.todos, activeCount: res.locals.activeCount, completedCount: res.locals.completedCount });
  } catch (error) {
    next(error);
  }
});

router.post('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await query("SELECT * FROM todos WHERE id = ?", [id]);
    let completed = todo[0].completed;
    if(todo[0].completed == 0) {
     completed = 1;
    } else {
      completed = 0;
    }

    const response = await query("UPDATE todos SET completed = ? WHERE id = ?", [completed, id]);
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/:id/delete', async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await query("DELETE FROM todos WHERE id = ?", [id]);
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id } = req.user[0];
    const response = await query("INSERT INTO todos (title, owner_id, completed) VALUES (?, ?, ?)", [title, id, 0]);
    return res.redirect('/');
  } catch (error) {
    next(error)
  }
});

router.post('/edit/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const response = await query("UPDATE todos SET title = ? WHERE id = ?", [title, id]);
    return res.redirect('/');
  } catch (error) {
    next(error);
  }
});



module.exports = router;
