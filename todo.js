var bindAdd = function() {
  var addButton = e('#id-add-todo')
  bindEvent(addButton, 'click', function() {
    var input = e('#id-input-todo')
    var todo = input.value
    saveTodo(todo)
    insertTodo(todo)
  })
}
var insertTodo = function (todo) {
  var todoContainer = e('.todo-container')
  var t = templateTodo(todo)
  appendHtml(todoContainer, t)
}
var templateTodo = function(todo) {
  var t = `
        <div class='todo-cell'>
          <span>&nbsp</span>
          <button class='todo-delete'>Dele</button>
          <span class='todo-content'>${todo}</span>
        </div>
    `
  return t
}
var bindDelete = function () {
  var todoContainer = e('.todo-container')
  bindEvent(todoContainer, 'click', function (e) {
    var self = e.target
    if (self.classList.contains('todo-delete')) {
      var c = self.nextSibling.nextSibling.innerText
      deleteTodo(c)
      var todoDiv = self.parentElement
      todoDiv.remove()
    }
  })
}
var saveTodo = function (todo) {
  var TodoContents = AV.Object.extend('TodoContents');
  var todoContents = new TodoContents();
  todoContents.set('owner', AV.User.current());
  todoContents.set('message', todo);
  todoContents.save().then(function() {
    log('保存到数据库')
  }, function(error) {
    log(error)
  });
}
var _delete = function (t) {
  var todo = AV.Object.createWithoutData('TodoContents', t);
    todo.destroy().then(function (success) {
    log('从数据库删除')
    }, function (error) {
    });
}
var deleteTodo = function (c) {
  var query = new AV.Query('TodoContents');
  var todos = []
  query.find(AV.User.current().id).then(function (todos) {
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].attributes.message == c) {
        var t = todos[i].id
        _delete(t)
        break
      }
    }
  }, function (error) {
  })
}
var userInfo = function () {
  var currentUser = AV.User.current();
  var name = currentUser.attributes.username
  var user = e('.current-user')
  appendHtml(user, name)
}
var getUserInfo = function (className) {
  var query = new AV.Query(className);
  var currentUser = AV.User.current();
  if (currentUser !== null) {
    query.find().then(function (information) {
      for (var i = 0; i < information.length; i++) {
        if (information[i].attributes.owner.id === currentUser.id) {
          log('information' ,information[i])
          insertTodo(information[i].attributes.message)
        }
      }
    }).catch(function(error) {
      alert(JSON.stringify(error));
    });
  } else {
    log('未登陆')
  }
}
var initTodo = function () {
  getUserInfo('TodoContents')
}
var bindEvents = function () {
  bindAdd()
  bindDelete()
}
var __main = function () {
  userInfo()
  initTodo()
  bindEvents()
}

__main()
