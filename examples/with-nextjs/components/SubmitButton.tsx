import { ImSpinner9 } from 'react-icons/im'

export function Spinner() {
  return <ImSpinner9 className="absolute left-0 -ml-6 top-1 animate-spin" />
}

const SubmitButton = ({ name, loading = false, onClick }) => {
  return (
    <button
      onClick={() => onClick()}
      disabled={loading}
      type="button"
      className="z-0 flex items-center justify-center w-full px-4 py-2 text-sm font-medium transition duration-150 ease-in-out bg-black border border-transparent rounded-md hover:bg-gray-500 focus:outline-none focus:shadow-outline-purple active:bg-black"
    >
      <span className="relative z-0 self-center text-white">
        {loading ? <Spinner /> : null}
        {name}
      </span>
    </button>
  )
}

export default SubmitButton
