import React from 'react'

export default function MyApplications(props) {
    const [applications, setapplications] = useState([])

    function getAllicationCards(){

    }
    async function handleSetApplications(){
        
    }
    useEffect(() => {
      handleSetApplications()
    
    }, [])
    
  return (
    <div>
      <div>
        <span className=' font-bold text-2xl'>Applications</span>
        <div>

        </div>
      </div>
    </div>
  )
}
