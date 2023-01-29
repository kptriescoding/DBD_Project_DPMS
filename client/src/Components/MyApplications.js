import { async } from '@firebase/util'
import React from 'react'

export default function MyApplications(props) {
    const [applications, setapplications] = useState([])

    function getAllicationCards(){

    }
    async function handleSetApplications(){

    }
    async function handleDeleteApplications(){

    }

    async function handleAcceptOrRejectApplications(projectId,Student_Email,isAccept){

    }
    useEffect(() => {
      handleSetApplications()
    
    }, [])
    
  return (
    <div>
      <div>
        <span className=' font-bold text-2xl'>Applications</span>
        <div>
{/* @todo Professor side : student name year cgpa  accept reject*/}

        </div>
      </div>
    </div>
  )
}
