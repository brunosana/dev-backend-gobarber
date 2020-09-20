import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';
import Appointment from '../models/Appointment';
import User from '../models/User';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ provider_id, date }: Request): Promise<Appointment> {
        const appointmentsRepository = getCustomRepository(
            AppointmentsRepository,
        );

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate)
            throw Error('This appointment is alredy booked');

        const usersRepository = getRepository(User);

        const checkProviderId = await usersRepository.findOne({
            where: { id: provider_id },
        });

        if (!checkProviderId) throw Error('Provider does not exists');

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
