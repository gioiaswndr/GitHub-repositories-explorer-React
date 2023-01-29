import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import BarLoader from "react-spinners/BarLoader";
import Accordion from 'react-bootstrap/Accordion';
import { AiFillStar } from 'react-icons/ai';
import { useState } from 'react'


function App() {

  const [repo, setRepo] = useState(undefined)
  const [users, setUsers] = useState(undefined)
  const [searchName, setSearchName] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [isLoading, setIsloading] = useState(true)
  const [isSearching, setIsSearching] = useState(true)
  const [smShow, setSmShow] = useState(null);

  async function fetchUser(param) {
    try {
      setIsSearching(true)
      const { data } = await axios({
        url: `https://api.github.com/search/users?q=${param}&per_page=5`,
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28"
        }
      })
      setUsers(data?.items)
    } catch (error) {
      console.log(error)
    } finally {
      setSmShow(true)
      setIsSearching(false)
    }
  }

  async function fetchRepo(repoLink) {
    try {
      setIsloading(true)
      const { data } = await axios({
        url: `${repoLink}`,
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Accept": "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28"
        }
      })
      setRepo(data)
    } catch (error) {
      console.log(error)
    } finally {
      setIsloading(false)
    }
  }

  function submitSearch(e) {
    e.preventDefault()
    fetchUser(searchInput)
    setSearchName(searchInput)
    setSearchInput("")
  }

  return (
    <>

      <Form className='mx-5 mt-5' onSubmit={submitSearch}>
        <Form.Control
          placeholder='Enter username'
          className='rounded-0 '
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          required
        />
        <Button variant="primary" type='submit' className='w-100 mt-3 rounded-0'>Search</Button>
      </Form>

      {searchName &&
        <p className='mx-5 mt-3'>Showing users for {!searchName ? "" : ` "${searchName}"`}</p>
      }

      <Accordion defaultActiveKey="0" flush className='mx-5 mt-3 border-0 pb-5'>
        {!users ? "" :
          isSearching ? <div className='d-flex justify-content-center'>
            <BarLoader
              color="#0d6efd"
              loading={isLoading}
              margin={0}
              size={30}
              speedMultiplier={1}
            />
          </div> :
            users.length >= 1 ?
              users.map((user, index) => {
                return <Accordion.Item eventKey={index} key={index} onClick={() => fetchRepo(user.repos_url)} className='border-0'>
                  <Accordion.Header className='border my-3'>{user.login}</Accordion.Header>
                  {isLoading ? <Accordion.Body className='my-2'>
                    <div className='d-flex justify-content-center'>
                      <BarLoader
                        color="#0d6efd"
                        loading={isLoading}
                        margin={0}
                        size={30}
                        speedMultiplier={1}
                      />
                    </div>
                  </Accordion.Body> :
                    repo.length >= 1 ? repo?.map((item, index) => {
                      return (
                        <Accordion.Body key={index} className='bg-Light my-4 border shadow rounded'>
                          <div className='d-flex justify-content-between'>
                            <div>
                              <p className='fw-bold'>{item.name}</p>
                              <p className='text-start'>
                                {item.description}
                              </p>
                            </div>
                            <div className='ms-1'>
                              <p className='text-nowrap'>{item.stargazers_count} <AiFillStar /></p>
                            </div>
                          </div>
                        </Accordion.Body>
                      )
                    }) : <Accordion.Body className='bg-Light my-2 border m-auto'>
                      <div className='text-center'>
                        <p className='m-auto fs-4'>Repository is empty</p>
                      </div>
                    </Accordion.Body>
                  }
                </Accordion.Item>
              }) : <Modal
                size="sm"
                show={smShow}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="example-modal-sizes-title-sm">
                    Error 404
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>Users not found!</Modal.Body>
              </Modal>
        }

      </Accordion>
    </>
  );
}

export default App;
