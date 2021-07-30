Tasks = [];

function Task(desc){
    this.taskId = uuidv4();
    this.description = desc;
    this.isCompleted = false;
    this.createdAt = new Date();
}

todoForm.addEventListener('submit',(event) => {
    event.preventDefault();
    let taskDesc = document.todoForm.task.value;
    if(taskDesc !== ''){
        let newTask = new Task(taskDesc)
        Tasks.push(newTask);
        addToLocalStorage(Tasks)
        document.todoForm.task.value = '';
    }
});

const addToDOM = (tasks) => {
    let rootDiv = document.getElementById('taskList');
    rootDiv.innerText='';
    tasks.forEach( (task) => {
        
        let taskElem = document.createElement("div");
        taskElem = addCSSClasses(taskElem,'todo-item');
        taskElem.id = task.taskId;
        
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.isCompleted;
        checkbox.addEventListener('change',()=>{ taskStatus(event.target.parentElement.id )})

        let taskDesc = document.createElement("input");
        taskDesc.disabled = "true";
        taskDesc.value = task.description;
        taskDesc = addCSSClasses(taskDesc,'todo-desc');
        if(checkbox.checked){
            taskDesc.style.textDecoration="line-through"
        }

        let btnEdit = document.createElement("i");
        btnEdit = addCSSClasses(btnEdit,"fa","fa-edit","btn-edit")
        btnEdit.addEventListener('click',()=>{edit(event.target.parentElement.id)})

        let btnDel = document.createElement("i");
        btnDel = addCSSClasses(btnDel,"fa","fa-times","btn-del");
        btnDel.addEventListener('click',()=>{del(event.target.parentElement.id)})

        let taskLog = document.createElement("p");
        taskLog.innerText= task.createdAt;

        taskElem.appendChild(checkbox);
        taskElem.appendChild(taskDesc);
        taskElem.appendChild(btnDel);
        taskElem.appendChild(btnEdit);
        taskElem.appendChild(taskLog);

        rootDiv.appendChild(taskElem)
    });

}
const addCSSClasses = (elem, ...classlist) => {
    classlist.forEach((cssclass) => {
        elem.classList.add(cssclass)
    });
    return elem;
}

const del = (id) => {
    document.getElementById(`${id}`).remove();
        Tasks = Tasks.filter((item) => {
          return item.taskId !== id;
        });

        addToLocalStorage(Tasks);
    }

const taskStatus = (id) => {
    let selectTask = Tasks.find((task)=>{
        return task.taskId === id;
    });
    selectTask.isCompleted = !selectTask.isCompleted
    addToLocalStorage(Tasks)
}

const edit = (id) => {
    let parentDiv = document.getElementById(`${id}`)
    let input = parentDiv.getElementsByClassName('todo-desc')[0];
    let btnEdit = parentDiv.getElementsByClassName('btn-edit')[0];
    input.disabled = false;
    input.focus();
    
    btnEdit.classList.remove('fa-edit');
    btnEdit.classList.add('fa-check');

    btnEdit.addEventListener('click', () => { 
            if(input.value.length > 0) {
                let confirmMsg = confirm('Do You want to update task?');
                if( confirmMsg ){
                    taskUpdate( id, input ,btnEdit);
                } else {
                    input.disabled = true;
                    btnEdit.classList.remove('fa-check');
                    btnEdit.classList.add('fa-edit');
                }
            }
            else alert('Provide some task description'); 
        })

}

const taskUpdate = (id, input ,btnEdit) => {
        let selectTask = Tasks.find((task)=> {
            return task.taskId === id;
        });
        selectTask.description = input.value;
        selectTask.createdAt =new Date();   

        btnEdit.classList.remove('fa-check');
        btnEdit.classList.add('fa-edit');
        input.disabled = true;
        btnEdit.addEventListener('click', () => {edit(event.target.parentElement.id)});
        
        addToLocalStorage(Tasks)
}


const addToLocalStorage = (tasks) => {
    localStorage.setItem('todoList',JSON.stringify(tasks));
    addToDOM(tasks);
}

const fetchTodos = () => {
    const obj = localStorage.getItem('todoList'); 
    if(obj){
        tasks=JSON.parse(obj);
        tasks.forEach((item) => {
            Tasks.push(item)
        })

        addToDOM(tasks)
    }
}

fetchTodos();

todoForm.reset.addEventListener('click',() => {
    Tasks = [];
    localStorage.clear();
    taskList.innerText = '';
});


