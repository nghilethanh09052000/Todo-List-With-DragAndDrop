/// <reference path='models/drag-drop-interface.ts'/>
/// <reference path='models/project-model.ts'/>
/// <reference path='state/project-state.ts'/>
/// <reference path='utils/validation.ts'/>
/// <reference path='decorators/autobind.ts'/>
/// <reference path='components/component-base.ts'/>
/// <reference path='components/project-item.ts'/>
/// <reference path='components/project-list.ts'/>
/// <reference path='components/project-input.ts'/>
namespace App {
    
    new ProjectInput();
    new ProjectList('active')
    new ProjectList('finished')

}