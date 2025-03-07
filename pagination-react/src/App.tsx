import { useState, useEffect } from "react"
import { Button } from "./components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";

type D = {
  name: string,
  email: string,
  phoneNumber: string
}

type response = {
  data: []
  nbHits: number
}

function App() {

  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(5);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams({
    page: pageNumber.toString(),
    limit: limit.toString()
  })

  useEffect(() => {
    setLoading(true);
    const fetchData = async() => {
      try {
        const response = await fetch(`http://localhost:5000/data?${params}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const responseData: response = await response.json();
        console.log("Response Data =", responseData);
        setData(responseData.data);
        setTotalData(responseData.nbHits);
      } catch(err) {
        console.log("An error occured while fetching data =", (err as Error).message);
        return;
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageNumber, limit]);

  const totalPages = Math.ceil(totalData/limit);
  console.log("Total Pages =", totalPages);

  const buttonArray:number[] = [];
  for(let i=1; i<=totalPages; i++) {
    buttonArray.push(i);
  }

  const skeletonCountArray: number[] = [];
  for(let i=1; i<=limit; i++) {
    skeletonCountArray.push(i);
  }
  
  return (
    <>
      <h1 className="text-4xl text-center m-4">Server based Pagination</h1>
      <div className="flex justify-center">
        <Select onValueChange={(value) => setLimit(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {
        loading ?
        (
          <div className="space-y-2">
            {
              <Skeleton className="w-100 rounded-lg" />
            }
          </div>
        )
        :
        (
          <ul className="px-10 my-10">
            {data.map((d: D, index) => (
              <li 
                key={index} 
                className="mx-1 p-4 my-4 shadow rounded-lg flex justify-between cursor-pointer transition duration-300 hover:bg-emerald-100 hover:-translate-y-2"
              >
                <span>{d.name}</span>
                <span>{d.email}</span>
                <span>{d.phoneNumber}</span>
              </li>
            ))}
          </ul>
        )
      }
      {!loading && <div className="px-10 mb-10 flex justify-center">
        {buttonArray.map((number, index) => (
          <Button
            key={index}
            className="mx-1"
            onClick={() => setPageNumber(number)}
          >
            {number}
          </Button>
        ))}
      </div>}
    </>
  )
}

export default App
