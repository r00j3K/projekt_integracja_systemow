import axios from "axios";

const handleLogout = async () => {
    try {
        await axios.post('http://localhost:8080/api/users/logout', {}, { withCredentials: true });
        window.location.reload();
    } catch (err) {
        console.log('Logout error:', err);
    }
}

export { handleLogout };
