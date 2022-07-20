namespace App{
    
//Autobind Decorator:
export function autobind(
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
}