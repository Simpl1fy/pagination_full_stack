import { useState, useEffect } from "react"
// import { Button } from "./components/ui/button";

type D = {
  name: string,
  email: string,
  phoneNumber: string
}

function App() {

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(5);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);

  const params = new URLSearchParams({
    page: pageNumber.toString(),
    limit: limit.toString()
  })

  useEffect(() => {
    const fetchData = async() => {
      try {
        const response = await fetch(`http://localhost:5000/data?${params}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData.data);
        setTotalData(responseData.nbHits);
      } catch(err) {
        console.log("An error occured while fetching data =", (err as Error).message);
        return;
      }
    }
    fetchData();
  }, []);

  const totalPages = Math.ceil(totalData/limit);
  console.log("Total Pages =", totalPages);

  return (
    <>
      <h1 className="text-4xl text-center m-2">Server based Pagination</h1>
      <ul>
        {data.map((d: D, index) => (
          <li key={index}>{d.name}</li>
        ))}
      </ul>
    </>
  )
}

export default App
