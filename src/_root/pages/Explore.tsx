import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import SearchResults from '@/components/shared/SearchResults'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/useDebounce'
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutation'
import { useState } from 'react'


const Explore = () => {

  const { data : posts , fetchNexPage, hasNextPage } = useGetPosts();

  const [searchValue, setSearchValue] = useState<string>("")
  
  const debouncedValue = useDebounce(searchValue, 500);
  const { data : searchedPots , isFetching : isSearchFetcing } = useSearchPosts(debouncedValue)

  if(!posts) {
    return(
      <div className='flex-center w-full h-full'>
        <Loader />
      </div>
    )
  }
  
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item  :any) => item.documents.length === 0)
  return (
    <div className='explore-container'>
        <div className='explore-inner_container'>
            <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
            <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
                <img 
                  src="/assets/icons/search.svg" 
                  height={24}
                  width={24}
                  alt='search'
                 />
                 <Input 
                    type="text" 
                    placeholder='Search' 
                    className='explore-search'
                    value={searchValue}
                    onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                    />
            </div>
        </div>  

        <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
            <h2 className='body-bold md:h3-bold w-full'>Popular Today</h2>

            <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
                <p className='small-medium md:base-medium text-light-2'>All</p>
                <img 
                  src="/assets/icons/filter.svg" 
                  width={20}
                  height={20}
                  alt="filter" 
                  className="" />
            </div>
        </div>    

        <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
              {
                shouldShowSearchResults ?
                (
                  <SearchResults />
                )
                :
                shouldShowPosts ?
                (
                  <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
                ) : 
                posts?.pages.map((item, index) => (
                  <GridPostList 
                    key={`page-${index}`}
                    posts={item?.documents}
                    />
                ))
                }
        </div>    
    </div>
  )
}

export default Explore