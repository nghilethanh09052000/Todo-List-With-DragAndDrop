namespace App{
    // Project State Management
type Listerner<T> = (items:T[]) => void;

class State<T>
{
    protected listeners:Listerner<T>[] = [];

    addListener(listenerFn:Listerner<T>)
    {
        this.listeners.push(listenerFn );
    }
}

export class ProjectState extends State<Project>
{
    
    private projects: Project[] = [];
    private static instance:ProjectState;

    private constructor()
    {
        super()
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
        this.UpdateListeners();
    }

    moveProject(projectId:string , newStatus:ProjectStatus)
    {
        const project = this.projects.find(prj=>prj.id ===projectId);
        if(project && project.status !== newStatus)
        {
            project.status = newStatus;
            this.UpdateListeners();
        }
    } 

    private UpdateListeners()
    {
        for (const listenerFn of this.listeners)
        {
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();
}