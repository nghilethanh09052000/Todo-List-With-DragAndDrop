// Project Type:
enum ProjectStatus {Active , Finished}
class Project{
    constructor(
        public id:string,
        public title:string,
        public description:string,
        public people:number,
        public status:ProjectStatus,
        ){}
}


// Project State Management
type Listerner = (items:Project[]) => void;
class ProjectState
{
    private listeners:Listerner[] = [];
    private projects: Project[] = [];
    private static instance:ProjectState;

    private constructor()
    {

    }

    static getInstance()
    {
        if(this.instance)
        {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn:Listerner)
    {
        this.listeners.push(listenerFn );
    }

    addProject(title:string,description:string,people:number) 
    {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            people,
            ProjectStatus.Active
        )

        this.projects.push(newProject);
        for (const listenerFn of this.listeners)
        {
            listenerFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

//Validation:
interface Validatable {
    value:string | number;
    required?:boolean;
    minLength?:number;
    maxLength?:number;
    min?:number;
    max?:number;
}

function Validate(validatableInput:Validatable)
{
    let isValid = true;

    if(validatableInput.required)
    {
        isValid =  isValid && validatableInput.value.toString().trim().length !== 0;
    }

    if(
        validatableInput.minLength != null && 
        typeof validatableInput.value === 'string'
        )
    {
        isValid = isValid && (validatableInput.value.length  > validatableInput.minLength);
    }

    if(
        validatableInput.maxLength != null && 
        typeof validatableInput.value === 'string'
        )
    {
        isValid = isValid && (validatableInput.value.length < validatableInput.maxLength);
    }

    if(validatableInput.min != null &&
        typeof validatableInput.value === 'number'
    )
    {
        isValid = isValid && (validatableInput.value >= validatableInput.min);
    }

    if(validatableInput.max != null &&
        typeof validatableInput.value === 'number'
    )
    {
        isValid = isValid && (validatableInput.value <= validatableInput.max);
    }
    return isValid;
}

//Autobind Decorator:
function autobind(
    _:any, //target
    _2:string, //methodName
    descriptor:PropertyDescriptor
    ){
        const originalMethod = descriptor.value;
        const adjDescriptor:PropertyDescriptor = {
            configurable:true,
            get()
            {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        }
        return adjDescriptor;
}


// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> 
{
    templateElement: HTMLTemplateElement;
    hostElement : T;
    element:U;
    
    constructor(
        templateId:string,
        hostElementId:string,
        insertAtStart:boolean,
        newElementId?:string,
    )
    {
        this.templateElement = <HTMLTemplateElement>document.getElementById(templateId)!;
        this.hostElement = <T>document.getElementById(hostElementId)!;
        
        const importedNode = document.importNode(
            this.templateElement.content,
            true
        )
        this.element = <U>importedNode.firstElementChild!;

        if(newElementId)
        {
            this.element.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtBeginning:boolean)
    {
        this.hostElement.insertAdjacentElement(
            insertAtBeginning
            ? 'afterbegin'
            : 'beforeend',
            this.element
        );
    }

    abstract configure?():void;
    abstract renderContent():void;

}
 

class ProjectList extends Component<HTMLDivElement,HTMLElement>
{
    assignedProjects:Project[];

    constructor(private type:'active'| 'finished' )
    {
        super('project-list','app',false,`${type}-projects`);

        this.assignedProjects=[];

        this.configure();
        this.renderContent();
    }

    configure()
    {
        projectState.addListener((projects:Project[])=>
        {   
            const relevantProjects = projects.filter(prj=>
                this.type === 'active'
                ? prj.status===ProjectStatus.Active
                : prj.status===ProjectStatus.Finished
            )
            this.assignedProjects = relevantProjects;
            this.renderProject();
        });
    }

    renderContent()
    {
        const listId = `${this.type}-project-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProject()
    {
        const listEl = <HTMLUListElement>document.getElementById(`${this.type}-project-list`);
        listEl.innerHTML = ''
        for (const prjItem of this.assignedProjects)
        {
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem)
        }
    }


}

class ProjectInput extends Component<HTMLDivElement,HTMLFormElement>
{
    titleInputElement:HTMLInputElement;
    descriptionInputElement:HTMLInputElement;
    peopleInputElement:HTMLInputElement;
    
    constructor()
    {
        super('project-input','app',true,'user-input');

        this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
        this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
        this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');
        
        this.configure();
    }

    configure()
    {
        
        this.element.addEventListener('submit',this.submitHandler);
    }

    renderContent()
    {
        
    }

    private gatherUserInput(): [string,string,number] | void
    {
        const enterTitle = this.titleInputElement.value;
        const enterDescription = this.descriptionInputElement.value;
        const enterPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value:enterTitle,
            required:true
        }
        const descriptionValidatable: Validatable = {
            value:enterTitle,
            required:true,
            minLength:5
        }
        const peopleValidatable: Validatable = {
            value: +enterPeople,
            required:true,
            min:1,
            max:5
        }
        
        if(
            !Validate(titleValidatable) &&
            !Validate(descriptionValidatable) &&
            !Validate(peopleValidatable)
        )
        {
            alert('Invalid input');
            return;
        }
        else
        {
            return [enterTitle,enterDescription, parseFloat(enterPeople)]
        }
    }

    private clearInputs()
    {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    
    @autobind
    private submitHandler(e:Event)
    {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput))
        {
            const [
                title,
                desc,
                people
            ] = userInput;
            projectState.addProject(title,desc,people)
            this.clearInputs()
        }
    }
    
  


}

const PrjInput = new ProjectInput();
const activePrjList = new ProjectList('active')
const finishPrjList = new ProjectList('finished')
