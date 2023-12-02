import React from 'react'

const Loader = () => {
  //w-full
  return (
    <div
        className='w-fit'
    >
        <img
            src='/assets/icons/loader.svg'
            alt='loader'
            width={24}
            height={24}
        />
    </div>
  )
}

export default Loader