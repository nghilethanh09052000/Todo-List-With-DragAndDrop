namespace App{
    
    export class ProjectInput extends Component<HTMLDivElement,HTMLFormElement>
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
}