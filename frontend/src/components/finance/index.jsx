import { useParams } from "react-router-dom";

const Finance = ()=>{
    const {id} = useParams();
    return(
        <div>
            {id}

        </div>
    )
}

export default Finance;