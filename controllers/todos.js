module.exports = {
  getTodos: async (req, res, next) => {
    try {
      const { id } = req.user[0];
      console.log(id)
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
      }
    } catch (error) {
      next(error);
    }
  }
}