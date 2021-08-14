import Form from '../components/Form'
import ListUsers from '../components/ListUsers'

export const IndexPage = (): JSX.Element => (
  <div className="flex flex-col h-screen bg-gray-50">
    <Form></Form>
    <ListUsers></ListUsers>
  </div>
)

export default IndexPage
