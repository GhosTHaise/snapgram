
const RootLayout = ({children} : { children : React.ReactNode}) => {
  return (
    <div className="w-full  md:flex">
        {children}     
    </div>
  )
}

export default RootLayout