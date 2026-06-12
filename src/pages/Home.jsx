import { useEffect, useState, useContext } from 'react'; // Combined your imports cleanly
import { ThemeContext } from "../context/ThemeContext";

import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

async function getData(movie) {
    try {
        const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=978e120b&s=${movie}`);
        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Full Error:", error);
        throw error;
    }
}

function Home() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('batman');

    // Grabbing your theme variables from Context
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        async function fetchMovieData() {
            try {
                const result = await getData(query);
                if (result && result.Search) {
                    setMovies(result.Search);
                } else {
                    setMovies([]);
                }
            } catch (err) {
                console.error("Failed to fetch movies in component", err);
            }
        }
        fetchMovieData();
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== '') {
            setQuery(searchTerm);
        }
    };

    return (
        <Container className="mt-4">
            <Form onSubmit={handleSearchSubmit} className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className='card-title'>Movie Search</h2>
                    <Button variant={theme === 'light' ? 'dark' : 'light'} onClick={toggleTheme}>
                        {theme === 'light' ? 'Dark 🌙' : 'Light ☀️'} Mode
                    </Button>
                </div>

                <InputGroup className="mb-3">
                    <Form.Control
                        className="theme-input"
                        placeholder="Search for a movie (e.g., Batman, Avengers...)"
                        aria-label="Movie search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                        Search
                    </Button>
                </InputGroup>
            </Form>

            <Row xs={1} md={3} lg={4} className="g-4">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <Col key={movie.imdbID}>
                            <Card className="h-100 theme-card">
                                <Card.Img
                                    variant="top"
                                    src={movie.Poster !== "N/A" ? movie.Poster : "https://i.ibb.co/gFLCcvHM/image.png"}
                                    alt={movie.Title}
                                    style={{ height: '350px', objectFit: 'cover' }}
                                />
                                <Card.Body>
                                    <Card.Title>{movie.Title}</Card.Title>
                                    <Card.Text>Year: {movie.Year}</Card.Text>
                                    <Card.Text className={theme === 'dark' ? 'text-light-50' : 'text-muted'}>
                                        Type: {movie.Type}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Body>
                                    <Card.Link
                                        href={`https://www.imdb.com/title/${movie.imdbID}`}
                                        target="_blank"
                                        className={theme === 'dark' ? 'text-warning' : 'text-primary'}
                                    >
                                        View on IMDb
                                    </Card.Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col xs={12}>
                        <p className="text-muted">No movies found. Try searching for something else!</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

export default Home;