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
            <section>
                <Outlet />
            </section>
          </>
        )
      }
    </>
  )
}

export default AuthLayout