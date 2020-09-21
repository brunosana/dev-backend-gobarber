import { Router, urlencoded } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../middlewares/upload';

const usersRoutes = Router();
const upload = multer(uploadConfig);

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

usersRoutes.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        try {
            const updateUserAvatarService = new UpdateUserAvatarService();

            const user = await updateUserAvatarService.execute({
                user_id: request.user.id,
                avatarFilename: request.file.filename,
            });

            delete user.password;

            return response.json(user);
        } catch (err) {
            return response.status(400).json({ error: err.message });
        }
    },
);

export default usersRoutes;
