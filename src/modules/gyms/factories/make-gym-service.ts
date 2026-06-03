import { GymsRepository } from "../gyms-repository";
import { GymsService } from "../gyms-service";

export function makegymsService() {
    const gymsRepository = new GymsRepository();
    const gymsService = new GymsService(gymsRepository);

    return gymsService

}