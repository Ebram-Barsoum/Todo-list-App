//window.localStorage.removeItem("app");
//window.sessionStorage.removeItem("active_list");

// Global Variables
let add_list_btn = document.querySelector('.add-list-btn');
let popup = document.querySelector('.popup');
let new_list_btn = document.querySelector('.popup .new-list-btn');

// initialize the application
function initiate(){
    let app = {};

    console.table(window.localStorage.getItem("app"));
   
    if(window.localStorage.getItem("app") != null){
        app = JSON.parse(window.localStorage.getItem("app"));
        for(const list in app){
            createList(list,app[list]["date"]);
        }

        let length = 0;
        for (let list in app) length++;

        if(length === 0) window.sessionStorage.removeItem("active_list");
    }
    else {
        window.sessionStorage.removeItem("active_list");
    }
   

    if (window.sessionStorage.getItem("active_list") != null) {
        let input = document.querySelector('.new-task-input');
        input.focus();
        
        let active_list = window.sessionStorage.getItem("active_list");
        let current_list = document.querySelector('.'+active_list);
        current_list.classList.add('active');

        active_list = `${active_list.replace(/-/g, ' ')}`;
        
        for (let task of app[active_list]["tasks"]) {
            createTask(task["name"],task["status"]);
        }

    }

    //handling small screen view
    if (window.innerWidth < 767) {
        document.getElementById("collapse").classList.toggle("show");
    }
    return app;
}

let app = initiate();

// showing the popup
add_list_btn.addEventListener('click', () => {
    let input = document.querySelector('.new-list-input');
    input.focus();

    document.querySelector('.popup .error').innerHTML = "";
});

// creating list and save it into local storage
function createList(name,date) {
    let lists = document.querySelector('.lists .added');
    let list = document.createElement('div');
    
    list.className = `${name.replace(/\s/g,'-')} list d-flex justify-content-between align-items-center shadow-sm p-2 fs-6 fw-bold rounded-3 border bg-body`;
   // console.log(list.classList);
   
    let listName = document.createElement('span');
    let listDate = document.createElement('p');
    listDate.className = 'text-muted list-date d-flex justify-content-center align-items-center m-0';

    listDate.innerText = date;
    listName.innerText = name;
    
    let del_btn = document.createElement('button');
    del_btn.className = "btn border-0";
    del_btn.setAttribute("title","Click Me To Delete The List");
    del_btn.innerHTML = `<i class="fa-regular fa-trash-can fs-5 text-danger delete-list-btn"></i>`;

    
    list.appendChild(listName);
    list.appendChild(listDate);
    list.appendChild(del_btn);
    lists.appendChild(list);
}

new_list_btn.addEventListener('click',(e)=>{

    let listName = [document.querySelector('.new-list-input').value].join('_');
    let listDate = document.getElementById('list-date').value;

     document.querySelector('.new-list-input').value =  document.getElementById('list-date').value = "";
    
     if(listName.trim() !=''){
        
        console.log(listName,' --> ',listDate);
        createList(listName,listDate);
        
        app[listName] = { "date": `${listDate}`, "tasks": [] };
        window.localStorage.setItem("app", JSON.stringify(app));
         
        window.location.reload();
    }
     else {
         document.querySelector('.popup .error').innerHTML = '*This field can not be blank';
    }
       
});

// deleting lists
function deleteList(name) {
    delete app[name];
    window.localStorage.setItem("app", JSON.stringify(app));
    window.location.reload();
}

const delete_list_btns = document.querySelectorAll('.delete-list-btn');
delete_list_btns.forEach((delete_list_btn)=>{
    delete_list_btn.addEventListener('click',(e)=>{
        console.log(e.target.tagName);
      
        let current_list = e.target.parentNode.parentNode;
        let name = current_list.classList[0];
        console.log(name);
        if (name === window.sessionStorage.getItem("active_list")) {
            window.sessionStorage.remove("active_list");
        }

        name = name.replace(/-/g, " ");
        console.log(name);

        deleteList(name);
        current_list.remove();   
       
    });

   
});

// selecting list to add tasks into or to show tasks relevant
let lists = document.querySelectorAll('.added .list');
let spans = document.querySelectorAll('.added .list span');

lists.forEach((list)=>{
    list.addEventListener('click', (event) => {
        let input = document.querySelector('.new-task-input');
        input.focus();

       lists.forEach(List => { 
           if (List.classList[0] == event.target.classList[0]) {
                
               List.classList.add('active');
               
               document.querySelector('.tasks .content').innerHTML = "";

               for (let list in app) {
                    if (list === List.classList[0].replace(/-/g, ' ')) {
  
                        for (let task of app[list]["tasks"]) {
                            createTask(task["name"],task["status"]);
                        }
                    }
               }
             
                window.sessionStorage.setItem("active_list",List.classList[0]);
            }
            else{
                List.classList.remove('active');
            }
       });
       
        window.location.reload();
   });
});

// creating task
function createTask(name, done = false){
    let task = document.createElement('div');
    let tasks = document.querySelector('.tasks .content');

    task.className = `${name.replace(/\s/g,'-')} task d-flex justify-content-between align-items-center p-2 shadow-sm bg-body rounded-3 border border-1 overflow-hidden flex-wrap`;

    let taskInfo = document.createElement('div');
    taskInfo.className = 'task-info d-flex align-items-center gap-2 w-75';
    let status = document.createElement('span');
    status.innerHTML = `<input type="checkbox" class="form-check-input status">`;
    let taskName = document.createElement('span');
    taskName.innerHTML = `<input type="text" value="${name}" class="task-name flex-grow-1" readonly>`;

    taskInfo.appendChild(status);
    taskInfo.appendChild(taskName);

    let taskActions = document.createElement('div');
    taskActions.className = 'd-flex justify-content-end gap-2 w-25';

    let edit = document.createElement('span');
    edit.innerHTML = `<i class="fa-regular fa-pen-to-square fs-5"></i>`;
    edit.className = 'edit-task-btn btn border-0 text-warning fw-bold';
    edit.setAttribute("title", "Click Me To Edit The Task");
    
    let del_task_btn = document.createElement('span');
    del_task_btn.className = "delete-task-btn btn border-0 text-danger fw-bold";
    del_task_btn.setAttribute("title","Click Me To Delete The Task");
    del_task_btn.innerHTML = '<i class="fa-solid fa-trash-can fs-5"></i>';
 
    if (done) {
        status.firstElementChild.setAttribute("checked", "checked");
        taskName.firstElementChild.classList.add('text-decoration-line-through');
        taskName.firstElementChild.classList.add('text-secondary');
    }


    taskActions.appendChild(edit);
    taskActions.appendChild(del_task_btn);

    task.appendChild(taskInfo);
    task.appendChild(taskActions);
    tasks.appendChild(task);
}

let add_task_btn = document.querySelector('.add-task-btn');
add_task_btn.addEventListener('click',()=>{
     let taskName = document.querySelector('.tasks input').value;
     document.querySelector('.tasks input').value = "";

    if (taskName.trim('') != '') {
        createTask(taskName);
        lists.forEach((list) => {
            if (list.classList.contains('active')) {
                let task = {"name":taskName,status:false};
                console.log(list);
                let List = list.classList[0].replace(/-/g, ' ');
                console.log(List);
                app[List]["tasks"].push(task);

                window.localStorage.setItem("app", JSON.stringify(app));
            }
    
            
        });
    }
    window.location.reload();
});

// deleting task
function deleteTask(list, task) {

    let indx = -1;
    for (let Task of app[list]["tasks"]) {
        indx++;

        if (Task["name"] == task) {
            app[list]["tasks"].splice(indx, 1);
            
            window.localStorage.setItem("app", JSON.stringify(app));
            window.location.reload();
        }
    }
    
}
let delete_task_btns = document.querySelectorAll('.delete-task-btn');

delete_task_btns.forEach((delete_task_btn)=>{

    delete_task_btn.addEventListener('click',(e)=>{
        let current_list = window.sessionStorage.getItem("active_list").replace(/-/g,' ');;
        let task_to_be_deleted = e.target.parentNode.parentNode.parentNode.classList[0];
        document.querySelector(`.${task_to_be_deleted}`).remove();

        task_to_be_deleted = task_to_be_deleted.replace(/-/g, ' ');

        deleteTask(current_list, task_to_be_deleted);
        
        
        
    });
});

// mark completed tasks
let check_inputs = document.querySelectorAll('.status');
check_inputs.forEach((check_input) => {
    check_input.addEventListener('click', () => {
        let task = check_input.parentNode.parentElement.parentNode.classList[0].replace(/-/g, ' ');
        let current_list = window.sessionStorage.getItem("active_list").replace(/-/g, ' ');
        let size = app[current_list]["tasks"].length;
        for (let indx = 0; indx < size; indx++ ) {
        
            if (app[current_list]["tasks"][indx]["name"] == task) {
              
                app[current_list]["tasks"][indx]["status"] = 1 - app[current_list]["tasks"][indx]["status"];
                
                window.localStorage.setItem("app", JSON.stringify(app));
             
                window.location.reload();
            }
        }

        
    });
});

// edit tasks
let edit_task_btns = document.querySelectorAll('.edit-task-btn');
edit_task_btns.forEach((edit_task_btn) => {
    edit_task_btn.addEventListener('click', (e) => {
        let task = e.target.parentNode.parentNode.parentNode.classList[0];
        let inputName = document.querySelector(`.${task} .task-name`);
        let oldName = inputName.getAttribute("value");
            
        console.log(inputName);
        console.log(oldName);

        inputName.removeAttribute("readonly");
        inputName.focus();

        inputName.addEventListener('blur', () => {
            let newName = inputName.value;
            let active_list = window.sessionStorage.getItem("active_list");
            
            active_list = active_list.replace(/-/g, ' ');
            task = task.replace(/-/g, ' ');

            for (let indx = 0; indx < app[active_list]["tasks"].length; indx++){
                if (app[active_list]["tasks"][indx]["name"] === oldName) {
                    app[active_list]["tasks"][indx]["name"] = newName;
                    break;
                }
            }

            window.localStorage.setItem("app", JSON.stringify(app));
            window.location.reload();

        });
    });
});






