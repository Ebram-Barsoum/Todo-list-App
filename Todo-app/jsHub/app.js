// Global Variables
let add_list_btn = document.querySelector('.add-list-btn');
let popup = document.querySelector('.popup');
let overlay = document.querySelector('.overlay');
let popup_close_btn = document.querySelector('.popup-close-btn');
let new_list_btn = document.querySelector('.popup .new-list-btn');



// initialize the application
function initiate(){

    console.log(window.localStorage.getItem("app"));
    let app = {};
    
    if(window.localStorage.getItem("app") != null){
        app = JSON.parse(window.localStorage.getItem("app"));
        for(const key in app){
            createList(key.replace('/-/g',' '));
        }
    }


    if (window.sessionStorage.getItem("active_list") != null) {
        let input = document.querySelector('.new-task-input');
        input.focus();
        
        let active_list = window.sessionStorage.getItem("active_list");
        
        active_list = `${active_list.replace(/\s/g, '-')}`;
        let current_list = document.querySelector('.'+active_list);
      
        current_list.classList.add('active');
        console.log(active_list);
        app[active_list].forEach((task)=>{
            createTask(task);
        });
    }
    return app;
}

let app = initiate();

// showing the popup
add_list_btn.addEventListener('click', () => {
    let input = document.querySelector('.new-list-input');
    input.focus();

    document.querySelector('.popup .error').innerHTML = "";

    overlay.style.cssText = 'display:block !important';
    popup.style.cssText = "opacity:1 !important; z-index:3 !important;";
});

// closing the popup
popup_close_btn.addEventListener('click',()=>{
    overlay.style.cssText = 'display:none !important';
   popup.style.cssText = "opacity:0 !important;  z-index:-1 !important;";
});


// creating list and save it into local storage
function createList(name) {
    let lists = document.querySelector('.lists .added');
    let list = document.createElement('div');
    
    list.className = `${name.replace(/\s/g,'-')} list d-flex justify-content-between align-items-center shadow-sm p-2 fs-5 fw-bold rounded-3 border bg-body`;
   // console.log(list.classList);
   
  
    let listName = document.createElement('span');
    

    listName.innerText = name.replace(/-/g,' ');
    let del_btn = document.createElement('button');
    del_btn.className = " btn border-0 ";
    del_btn.setAttribute("title","Click Me To Delete The List");
    del_btn.innerHTML = `<i class="fa-regular fa-trash-can fs-5 text-danger delete-list-btn"></i>`;

    
    list.appendChild(listName);
    list.appendChild(del_btn);
    lists.appendChild(list);
}

new_list_btn.addEventListener('click',(e)=>{

     let listName = [document.querySelector('.new-list-input').value].join('_');
     document.querySelector('.new-list-input').value = "";
    
     if(listName.trim() !=''){
        
        console.log(listName);
        createList(listName);

        app[listName.replace(/\s/g,'-')] = [];
        window.localStorage.setItem("app", JSON.stringify(app));
        
        overlay.style.display = 'none';
        popup.style.opacity = '0';
         
        window.location.reload();
    }
     else {
         document.querySelector('.popup .error').innerHTML = '*This field can not be blank';
    }
       
});

// deleting lists
function deleteList(classname){
    delete app[classname];
    window.localStorage.setItem("app",JSON.stringify(app));
}

const delete_list_btns = document.querySelectorAll('.delete-list-btn');

delete_list_btns.forEach((delete_list_btn)=>{
    delete_list_btn.addEventListener('click',(e)=>{
        console.log(e.target.tagName);
      
        let current_list = e.target.parentNode.parentNode;
        let name = current_list.classList[0];
        
        
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
             console.log(event.target.tagName);
           if (List.classList[0] == event.target.classList[0]) {
                
               List.classList.add('active');
               
                document.querySelector('.tasks .content').innerHTML = "";
                app[List.classList[0]].forEach((task)=>{
                    createTask(task);
                });
               
                window.sessionStorage.setItem("active_list",List.classList[0]);
            }
            else{
                List.classList.remove('active');
            }

     
       });
       
       let delete_task_btns = document.querySelectorAll('.delete-task-btn');
       console.log(delete_task_btns);
       delete_task_btns.forEach((delete_task_btn)=>{

           delete_task_btn.addEventListener('click',(e)=>{

               let current_list = window.sessionStorage.getItem("active_list");
               let task_to_be_deleted = e.target.parentNode;

               console.log(task_to_be_deleted);

               deleteTask(current_list, task_to_be_deleted);
               window.reload();
           });

       });

   });
});

// creating task
function createTask(name){
    let task = document.createElement('div');
    let tasks = document.querySelector('.tasks .content');

    task.className =JSON.stringify(name);
    task.className = "task d-flex justify-content-between align-items-center p-2 shadow-sm bg-body rounded-3 border border-1";

    let taskName = document.createElement('span');
    taskName.innerHTML = name;

    let del_task_btn = document.createElement('button');
    del_task_btn.className = "delete-task-btn btn btn-danger fw-bold";
    del_task_btn.setAttribute("title","Click Me To Delete The Task");
    del_task_btn.innerText = 'delete';

    task.appendChild(taskName);
    task.appendChild(del_task_btn);
    tasks.appendChild(task);
}

let add_task_btn = document.querySelector('.add-task-btn');
add_task_btn.addEventListener('click',()=>{
     let task_name = document.querySelector('.tasks input').value;
     document.querySelector('.tasks input').value = "";

     if(task_name.trim('') != ''){
        createTask(task_name);
        lists.forEach((list)=>{
            if(list.classList.contains('active')){
                app[list.classList[0]].push(task_name);
            }
         });
    
         window.localStorage.setItem("app",JSON.stringify(app));
     }
   //  window.location.reload();
});

// deleting task
function deleteTask(list,task){
    
    app[list].forEach((item)=>{      
           console.log(`\"${task.firstChild.innerHTML}\"`);

           if(JSON.stringify(item) == `\"${task.firstChild.innerHTML}\"`){
           
                let indx = app[list].indexOf(item);
                app[list].splice(indx,1);
                task.remove();
                window.localStorage.setItem("app",JSON.stringify(app));
           }      
    }); 
}



