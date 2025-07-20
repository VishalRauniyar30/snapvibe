import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import { GridPostList, Loader } from '@/components/shared'
import useDebounce from '@/hooks/useDebounce'
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queries'
import { Input } from '@/components/ui/input'

export type SearchResultProps = {
    isSearchFetching: boolean;
    searchedPosts: any;
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
    if(isSearchFetching){
        return <Loader />
    } else if(searchedPosts && searchedPosts.documents.length > 0) {
        return <GridPostList posts={searchedPosts.documents} />
    } else {
        return(
            <p className='text-[#5C5C7B] mt-10 text-center w-full'>No Results Found</p>
        )
    }
}

const Explore = () => {
    const { ref, inView } = useInView()

    const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

    const [searchValue, setSearchValue] = useState('')
    const debouncedSearch = useDebounce(searchValue, 150)

    const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch)

    useEffect(() => {
        if(inView && !searchValue) {
            fetchNextPage()
        }
    }, [inView, searchValue])

    if(!posts) {
        return (
            <div className='flex items-center justify-center w-full h-full'>
                <Loader />
            </div>
        )
    }

    const shouldShowSearchResults = searchValue !== ""

    const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((item) => item.documents.length === 0)

    return (
        <div className='flex flex-col flex-1 items-center overflow-scroll custom-scrollbar py-10 px-5 md:p-14'>
            <div className='max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9'>
                <h2 className='text-[24px] font-bold leading-[140%] md:text-[30px] w-full'>
                    Search Posts
                </h2>
                <div className='flex gap-1 px-4 w-full bg-[#1f1f22] rounded-lg'>
                    <img 
                        src="/assets/icons/search.svg" 
                        alt="search"
                        width={24}
                        height={24} 
                    />
                    <Input
                        type='text'
                        placeholder='Search'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className='h-12 bg-[#1f1f22] border-none placeholder:text-[#5c5c7b] focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0'
                    />
                </div>
            </div>
            <div className='flex items-center justify-between w-full max-w-5xl mt-16 mb-7'>
                <h3 className='text-[18px] font-bold leading-[140%] md:text-[24px]'>
                    Popular Today
                </h3>
                <div className='flex items-center justify-center gap-3 bg-[#101012] rounded-xl px-4 py-2 cursor-pointer'>
                    <p className='text-[14px] font-medium leading-[140%] md:text-base text-[#efefef]'>
                        All
                    </p>
                    <img 
                        src="/assets/icons/filter.svg" 
                        alt="filter"
                        width={20}
                        height={20} 
                    />
                </div>
            </div>
            <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
                {shouldShowSearchResults ? (
                    <SearchResults
                        isSearchFetching={isSearchFetching}
                        searchedPosts={searchedPosts}
                    />
                ) : shouldShowPosts ? (
                    <p className='text-[#5c5c7b] mt-10 text-center w-full'>
                            End Of Posts
                    </p>
                ) : (
                    posts.pages.map((item, index) => (
                        <GridPostList key={`page-${index}`} posts={item.documents} />
                    ))
                )}
            </div>
            {hasNextPage && !searchValue && (
                <div ref={ref} className='mt-10'>
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Explore