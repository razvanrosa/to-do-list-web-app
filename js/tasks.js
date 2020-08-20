window.ToDoList = {

    //weak typed (js) vs strong typed(java)
    API_URL:"http://localhost:8082/tasks",

    createTask: function (){
        const descriptionValue = $('#task-description').val();
        const deadlineValue = $('#task-deadline').val();

        let body = {
            description: descriptionValue,
            deadline: deadlineValue
        };

        $.ajax({

            url: ToDoList.API_URL,
            method: "POST",
            //MIME type
            contentType: "application/jason",
            data: JSON.stringify(body)
        }).done(function (){
            ToDoList.getTask()
        });
    },

    getTask:function (){
        $.ajax({
            url: ToDoList.API_URL,
            method: "GET"
        }).done(function (response){
          ToDoList.displayTasks(JSON.parse(response));
        })

    },

    updateTask: function (id, done){
        let body ={
            "done": done
        };
        $.ajax({
            url: ToDoList.API_URL + '?id=' + id,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(body)
        }).done(function () {
            ToDoList.getTask();
        })
    },

    deleteTask: function(id) {
      $.ajax({
          url: ToDoList.API_URL + '?id=' + id,
          method: 'DELETE'
      }) .done(function (){
      }) ;
    },

    getTaskRow: function (task){
        //spread syntax
       let formattedDeadline = new Date(...task.deadline).toLocaleDateString("ro");
       //ternary operator
       let checkAttribute = task.done ? "checked" : "";

       /*if(task.done ){
           checkAttribute = "checked";
       }else{
           checkAttribute = "";
       }*/

        return `
           <tr>
              <td>${task.description}</td>
              <td>${formattedDeadline}</td>
              <td><input type="checkbox" class="mark-done" data-id=${task.id} ${checkAttribute}></td>
              <td><a href="#" class="delete-link" data-id=${task.id}><i class="fas fa-trash-alt" ></i></a> </td>
           </tr>
        `
    },

    displayTasks: function (tasks){
        let tasksHtml = '';
        tasks.forEach(task => tasksHtml += ToDoList.getTaskRow(task));
        $('#tasks tbody').html(tasksHtml);
    },

    bindEvents: function (){
        $('#create-task-form').submit(function (event){
            event.preventDefault();

            ToDoList.createTask();
        });

        $('#tasks').delegate('.mark-done','change',function (event) {
            event.preventDefault();

            const id = $(this).data('id');
            const checkboxChecked = $(this).is(':checked') ;

            ToDoList.updateTask(id, checkboxChecked);
        });

        $('#tasks').delegate('.delete-link','click',  function(event) {
            event.preventDefault();

            const id = $(this).data('id')
            ToDoList.deleteTask(id);
        });
    }

};

ToDoList.getTask();
ToDoList.bindEvents();