import ParameterViewMode from "./parameterViewMode"

interface IRenderParameterCards{
    myObject:IparameterObj[],
    deleteParameter:(index:number)=>void,
    updateElementAtIndex:(index: number, updatedValue: IparameterObj)=>void
}
interface IparameterObj{
    name:string,
    type:string,
    lowerBound?:string,
    upperBound?:string,
    options?:string[]
}
function RenderParameterCards({myObject,deleteParameter,updateElementAtIndex}:IRenderParameterCards){
    function updateElement(index: number, updatedValue: IparameterObj){
        updateElementAtIndex(index, updatedValue)
    }
    return(
        <>
        {myObject.map((js:IparameterObj,id:number)=>{
                        return(
                        <div data-testid="parameter-view-mode">
                            <ParameterViewMode index={id} 
                                deleteParameter={()=>{deleteParameter(id)}} jsonObject={js}
                                updateElementAtIndex={updateElement}
                            />
                        </div>
                        )
        })}
        </>
    )
}

export default RenderParameterCards