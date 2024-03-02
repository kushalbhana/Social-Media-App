import { useState } from "react"
import { Input } from "@/components/ui/input";

const Explore = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>
            
        <div className="flex-between w-full max-w-5xl mt-16 mb-7">
          <h3 className="body-bold md:h3-bold">Popular Today</h3>
          <div className="flex-center gap-3 bg-dark-3 rouded-xl px-4 py-2 cursor-pointer">
            <p className="small-medium">All</p>
          </div>
        </div>
      </div>
  )
}

export default Explore
