export function LoadingUI({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="mt-20 grid grid-cols-2 gap-3 sm:gap-8 md:grid-cols-3 xl:grid-cols-4">
        {children}
      </div>
    </>
  )
}
