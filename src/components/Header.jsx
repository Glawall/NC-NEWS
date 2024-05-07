import {Link} from 'react-router-dom'

function Header () {
    return (
        <header>
            <h1>Read Wall About It!</h1>
            <Link to = '/'> Home</Link>
            <br></br>
            <Link to = '/articles'>Articles</Link>
        </header>
    )
}

export default Header