import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
  const isAuthentificated = false;
  return (
    <>
      {
        isAuthentificated ? 
        (
          <Navigate to={"/"} />
        ) :
        (
          <>
            <section className="flex flex-1 justify-center items-center flex-col py-10">
                <Outlet />
            </section>
          </>
        )
      }
    </>
  )
}

export default AuthLayout