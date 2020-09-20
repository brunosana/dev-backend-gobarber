import { Router, urlencoded } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRoutes = Router();

usersRoutes.post('/', async (request, response) => {
    try {
        const { name, email, password } = request.body;
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({
            name,
            email,
            password,
        });

        delete user.password;

        return response.json();
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default usersRoutes;
