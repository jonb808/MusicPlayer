import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Card, Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = '346833786f664d3687393f8e726c5dd7';
const CLIENT_SECRET = '824b9b846b104ebe8d3e066fa81bc836';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]); //state will be set to the returned items array
  

  //initialize spotify api code
  useEffect(() => {
    //API access token, POST w/ specified headers & body required by spotify
    var authParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      
    }
    fetch('https://accounts.spotify.com/api/token', authParams)
    //process the promise returned by fetch()
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  //Search function
  async function search() {
    console.log('Search for ' + searchInput); 

    //Get request for Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-type': 'applications/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id })  

    console.log("Artist ID is " + artistID); //check the artistID value
    //Get request with Artist ID to grabll all their albums
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      })
    //Display albums to the user
  }
  console.log(albums);

  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
            placeholder='Search For Song'
            type='input'
            onKeyDown={event => {
              if (event.key == 'Enter') {
                search();
              }
            }}
            //when text changes on form, pass it to setSearchInput. Target is FormControl
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick = {search}>
            Search Button
          </Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map( (album, i) => {
            console.log(album);
            return(
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}      
          
        </Row>
      </Container>
    </div>
  );
}

export default App;
