import { ImSpinner9 } from 'react-icons/im'

export default function Spinner() {
  return (
    <div
      aria-label="loading"
      className="flex flex-col items-center justify-center text-3xl"
    >
      <ImSpinner9 className="text-blacak animate-spin" />
    </div>
  )
}
