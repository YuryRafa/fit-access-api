import { CheckInsRepository } from "../check-in-repository";
import { CheckInsService } from "../check-in-service";
import { GymsRepository } from "@/modules/gyms/gyms-repository";

export function makecheckInService() {
    const checkInRepository = new CheckInsRepository();
    const gymsRepository = new GymsRepository()
    const checkInService = new CheckInsService(checkInRepository, gymsRepository);

    return checkInService

}